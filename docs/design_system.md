# Design System

The project uses a premium, **Linear-inspired design system** with a focus on dark aesthetics, monochrome palettes, and micro-interactions.

## Design Philosophy

- **Minimalist & Clean**: Reducing visual noise to focus on content.
- **Dark Mode First**: Optimized for high-contrast dark environments.
- **Micro-Animations**: Subtle transitions (fade, slide) to provide feedback and a premium feel.
- **Precision Typography**: Using the **Inter** font family for maximum readability.

## Color Palette (Monochrome)

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#0A0A0A` | Main application background |
| `--bg-secondary` | `#111111` | Sidebars and navigation |
| `--bg-tertiary` | `#161616` | Cards and elevated surfaces |
| `--text-primary` | `#EBEBEB` | Headings and body text |
| `--text-secondary` | `#8A8A8A` | Meta information and labels |
| `--accent` | `#FFFFFF` | Primary actions and highlights |

## Typography

- **Font Family**: Inter (Google Fonts)
- **Scale**:
  - `xs`: 11px
  - `sm`: 13px
  - `base`: 14px (Standard)
  - `lg`: 16px
  - `xl`: 18px

## Spacing & Layout

- **Spacing Scale**: 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48).
- **Border Radius**: Subtle rounded corners (`sm: 4px`, `md: 6px`, `lg: 8px`).
- **Sidebar Width**: 260px (Standard Slack/Linear width).

## CSS Implementation

- **Vanilla CSS Modules**: For scoped styles and performance.
- **CSS Variables**: All design tokens are defined in `globals.css` as CSS variables for easy maintenance and reuse.
- **Keyframe Animations**: Predefined animations like `fadeIn`, `slideUp`, and `slideInLeft`.
