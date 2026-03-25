"use server";

export async function pepperPassword(password: string): Promise<string> {
  const pepper = process.env.PASSWORD_PEPPER || "";
  if (!pepper) {
    console.warn("PASSWORD_PEPPER is not set in environment variables!");
  }
  return password + pepper;
}
