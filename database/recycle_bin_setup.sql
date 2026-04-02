-- Database Recycle Bin for Supabase/PostgreSQL
-- Author: Antigravity
-- Description: Intercepts DROP TABLE commands and row DELETE commands to move them to a 'recycle_bin' schema.

-- 1. Create the Recycle Bin Schema
CREATE SCHEMA IF NOT EXISTS recycle_bin;

-- 2. Create Operation Log for Table Deletions
CREATE TABLE IF NOT EXISTS recycle_bin.operation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_schema TEXT NOT NULL,
    original_table_name TEXT NOT NULL,
    recycled_table_name TEXT NOT NULL,
    recycled_at TIMESTAMPTZ DEFAULT now(),
    deleted_by TEXT DEFAULT (select auth.email() from auth.users where id = auth.uid()),
    restored_at TIMESTAMPTZ,
    status TEXT DEFAULT 'recycled' CHECK (status IN ('recycled', 'restored', 'purged'))
);

-- 3. Create Container for Deleted Rows (Soft Delete Registry)
CREATE TABLE IF NOT EXISTS recycle_bin.deleted_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_schema TEXT NOT NULL,
    original_table TEXT NOT NULL,
    data JSONB NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT now(),
    deleted_by UUID DEFAULT (select auth.uid())
);

-- 4. Function: Move Table to Recycle Bin
-- This function renames a table and moves it to the recycle_bin schema.
CREATE OR REPLACE FUNCTION recycle_bin.recycle_table(target_table TEXT, target_schema TEXT DEFAULT 'public')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    timestamp_suffix TEXT;
    new_name TEXT;
BEGIN
    -- Check if table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = target_schema AND table_name = target_table
    ) THEN
        RAISE EXCEPTION 'Table %.% does not exist.', target_schema, target_table;
    END IF;

    -- Generate unique name with timestamp
    timestamp_suffix := to_char(now(), 'YYYYMMDD_HH24MISS');
    new_name := target_table || '_recycled_' || timestamp_suffix;

    -- Log the operation
    INSERT INTO recycle_bin.operation_log (original_schema, original_table_name, recycled_table_name)
    VALUES (target_schema, target_table, new_name);

    -- Move and Rename (Structure, Rows, Indexes follow)
    EXECUTE format('ALTER TABLE %I.%I SET SCHEMA recycle_bin', target_schema, target_table);
    EXECUTE format('ALTER TABLE recycle_bin.%I RENAME TO %I', target_table, new_name);

    RETURN format('Table moved to recycle_bin.%s', new_name);
END;
$$;

-- 5. Function: Restore Table from Recycle Bin
CREATE OR REPLACE FUNCTION recycle_bin.restore_table_from_bin(recycled_name TEXT, target_schema TEXT DEFAULT 'public')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    orig_name TEXT;
    orig_schema TEXT;
BEGIN
    -- Look up metadata
    SELECT original_table_name, original_schema 
    INTO orig_name, orig_schema
    FROM recycle_bin.operation_log
    WHERE recycled_table_name = recycled_name AND status = 'recycled'
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No record found for recycled table %', recycled_name;
    END IF;

    -- Move back and reset name
    EXECUTE format('ALTER TABLE recycle_bin.%I SET SCHEMA %I', recycled_name, target_schema);
    EXECUTE format('ALTER TABLE %I.%I RENAME TO %I', target_schema, recycled_name, orig_name);

    -- Update log
    UPDATE recycle_bin.operation_log 
    SET status = 'restored', restored_at = now() 
    WHERE recycled_table_name = recycled_name;

    RETURN format('Table %s restored to %s.%s', recycled_name, target_schema, orig_name);
END;
$$;

-- 6. Event Trigger: Prevent Accidental DROP TABLE
-- This trigger will block any direct DROP TABLE command in the public schema.
CREATE OR REPLACE FUNCTION recycle_bin.prevent_drop_table()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
    obj record;
BEGIN
    FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
    LOOP
        IF obj.schema_name = 'public' AND obj.object_type = 'table' THEN
            RAISE EXCEPTION 'Direct DROP TABLE on public schema is prohibited. Use recycle_bin.recycle_table(''%'') instead.', obj.object_name;
        END IF;
    END LOOP;
END;
$$;

-- Note: Event triggers must be created separately as they cannot be applied in all contexts.
-- DROP EVENT TRIGGER IF EXISTS abort_remote_drop;
-- CREATE EVENT TRIGGER abort_remote_drop ON sql_drop
-- EXECUTE FUNCTION recycle_bin.prevent_drop_table();


-- 7. Trigger Function: Row-Level Recycle (Soft Delete)
-- Moves deleted rows to a JSONB repository.
CREATE OR REPLACE FUNCTION public.soft_delete_handler()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO recycle_bin.deleted_entries (original_schema, original_table, data)
    VALUES (TG_TABLE_SCHEMA, TG_TABLE_NAME, to_jsonb(OLD));
    
    RETURN OLD; -- Still allows the deletion from the original table, but we have a copy.
END;
$$;

-- EXAMPLE of how to apply Row-Level Recycle to a table:
-- CREATE TRIGGER recycle_deleted_rows 
-- BEFORE DELETE ON public.your_table_name
-- FOR EACH ROW EXECUTE FUNCTION public.soft_delete_handler();

COMMENT ON SCHEMA recycle_bin IS 'Safety schema for deleted tables and data retention.';
