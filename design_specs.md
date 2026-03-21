# PromptVault Design Specification

This document serves as the official reference for designers and developers to maintain visual consistency across the PromptVault platform.

---

## 🖋️ Typography System (Global)

PromptVault uses a clean, high-performance typography system designed to scale from data-heavy tools to high-impact marketing sections.

### Primary Font: **Inter**
*   **Most Used**: The global default for the entire application.
*   **Integration**: Loaded via `next/font/google` in `RootLayout`.
*   **Weights Used**:
    *   **400 (Regular)**: Standard body text, descriptions.
    *   **500/600 (Medium/Semi-Bold)**: Navigation links, metadata, author names.
    *   **700 (Bold)**: Sub-headers, button labels, highlights.
    *   **900 (Black)**: Main page headers (h1), hero sections.
*   **Styling Note**: High-impact headers frequently use **900 weight + Italic** to create a premium "artistic" aesthetic.

### Secondary Font: **Space Grotesk**
*   **CSS Variable**: `--font-space`
*   **Use Case**: Specifically used for numerical data points, "tech-oriented" UI components, and futuristic data visualizations.
*   **Character**: Geometric and high-contrast.

---

## 🃟 Core Component: "Custom Replica" Prompt Card

This is the current gold standard for prompt representation on the platform. It utilizes a **premium glass-morphic** aesthetic combined with high-contrast, professional typography.

### 📏 Technical Specifications & Dimensions
| Element | Property | Value |
| :--- | :--- | :--- |
| **Container** | Layout | Vertical Flex (Card) |
| | Width | Full (Responsive/Fluid) |
| | Max Grid | 5 columns (Desktop) / 2 columns (Mobile) |
| | Corner Radius | `12px` (rounded-xl) |
| | Border | `1px` solid `#E2E8F0` (slate-200/80) |
| **Image Zone**| Height | `200px` (Fixed) |
| | Fit | `object-cover` (No cropping distortion) |
| | Background | `#F1F5F9` (slate-100) — *Placeholder during loading* |
| **Content Zone**| Padding | `12px` (Internal spacing on all sides) |
| | Background | `#FFFFFF` (Solid White) |

### ✨ Styling & Glass-morphism
*   **Platform Badge (Top-Left)**: 
    *   **Background**: `rgba(0,0,0, 0.7)` (Black 70%) with a `12px` Backdrop Blur.
    *   **Border**: `1px` white at `10%` opacity to define the edge against dark images.
    *   **Typography**: `10px`, **Black (900)**, all-caps, wide letter-spacing.
*   **Action Buttons (Top-Right)**:
    *   **Shape**: `32px x 32px` squares with `12px` rounded corners.
    *   **Fill**: `rgba(0,0,0, 0.4)` (Black 40%) with `12px` Backdrop Blur.
*   **Typography Hierarchy**:
    *   **Title**: `12px`, **Bold (700)**, slate-900. Clamped to 2 lines max.
    *   **Pills/Tags**: `8px` text, purple-600 on purple-50 background.
    *   **Price**: `12px`, Monospaced, **Bold**, Purple-600.
    *   **Author**: `10px`, Medium weight, slate-700.

### 🚀 Animations & Micro-Interactions
The card uses a "Tactile Response" interaction model:

1.  **Global Lift**:
    *   **Action**: On `:hover`, the border transitions to **Purple-600** and the shadow expands to `shadow-xl`.
    *   **Timing**: `300ms`, `ease-in-out` transition.
2.  **Image Portal**:
    *   **Action**: The image zooms in slightly (`scale: 1.05`) while the border holds.
    *   **Timing**: `700ms` for a smooth, cinematic feel.
3.  **Haptic Hover**:
    *   **Action**: Quick-view button shifts to solid **Purple-600**; Heart icon shifts to **Rose-400**.
    *   **Timing**: `150ms`.

### 🎨 Color Palette (Tailwind Tokens)
*   **Primary Accent**: `#7C3AED` (Purple-600)
*   **Soft Surface**: `#FAF5FF` (Purple-50)
*   **Solid Text**: `#0F172A` (Slate-900)
*   **Border Base**: `#E2E8F0` (Slate-200)
