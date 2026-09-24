# Design System: VKU Study Room Booking

This document defines the core aesthetic guidelines and design tokens for the VKU Study Room Booking app.

## Color Palette

The color palette is built around a vibrant, soft, and modern aesthetic. The primary colors convey a sense of calm focus (cyan/teal), while the accents provide clear visual feedback for actions and status (soft red/pink).

### Brand & Core Colors
| Token | Hex Code | Usage |
|-------|----------|-------|
| `primary-light` | **#CCFBFA** | Soft background accents, highlighted states, and secondary buttons. |
| `primary-main` | **#B1E5E6** | Primary actions (Book buttons), active filters, selected time slots, and headers. |
| `accent-light` | **#F7ADAD** | Warning states, occupied room badges, and cancelled booking labels. |
| `accent-main` | **#F29191** | Destructive actions (Cancel Booking), error states, and critical alerts. |

### Neutral Colors
To balance the vibrant brand colors, the app uses standard modern neutrals:
- **Background**: `#FFFFFF` (White) and `#F8FAFC` (Slate 50) for off-white screens.
- **Text Main**: `#0F172A` (Slate 900) for primary headings.
- **Text Secondary**: `#475569` (Slate 600) and `#64748b` (Slate 500) for subtitles and icons.
- **Borders**: `#E2E8F0` (Slate 200) for subtle dividers and borders.

## Typography
*Note: React Native uses system fonts by default. These weights represent structural guidelines.*

- **Headings (H1/H2)**: Bold (700/800 weight), large (24px-28px). Used for screen titles (e.g., "Discover Rooms").
- **Subtitles**: Medium (500 weight), 14px-16px, `Text Secondary` color.
- **Body / Badges**: Semi-bold (600 weight), 12px-14px. Designed for legibility inside small chips and badges.

## Component Guidelines

### 1. Room Cards
- **Background**: `#FFFFFF`
- **Border Radius**: `16px`
- **Shadow**: Soft elevation (`shadowOpacity: 0.05`, `shadowRadius: 12`) to create a "glassmorphism" or floating effect.
- **Interaction**: Scale down to `0.98` on press using `Pressable`.

### 2. Badges & Status
- **Available**: Uses a vibrant green (e.g., `rgba(34, 197, 94, 0.9)`) or `primary-main` (`#B1E5E6`) to signify readiness.
- **Occupied / Booked**: Uses `accent-light` (`#F7ADAD`) or `accent-main` (`#F29191`) to clearly indicate unavailability.
- **Filter Chips**: Unselected chips have a `#F1F5F9` background. Selected chips use `primary-main` (`#B1E5E6`).

### 3. Buttons
- **Primary Button**: Uses `primary-main` (`#B1E5E6`). High corner radius (`16px`) with a soft drop shadow matching the button color.
- **Disabled Button**: Grayscale (`#CBD5E1`) without shadow to indicate inactionability.
- **Destructive Button**: Uses `accent-main` (`#F29191`).

## Aesthetics & Micro-animations
- **Transitions**: State changes (like selecting a time slot) should feel immediate but soft.
- **Press Effects**: All interactive elements (Room Cards, Time Slots, Filter Chips, Back Buttons) implement a subtle `opacity: 0.8` and `scale: 0.98` or `0.95` transformation upon press.
- **Spacing**: Generous padding (`16px` to `20px` margins) to ensure touch targets are easily accessible on mobile devices and UI doesn't feel cluttered.
