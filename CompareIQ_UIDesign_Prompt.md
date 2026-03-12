# CompareIQ — Complete UI/UX Design Prompt for VS Code Copilot
> Paste this entire prompt into Copilot Agent when redesigning any page or component.
> Do NOT write new logic. Only apply design changes to existing components and pages.

---

## 🎨 DESIGN IDENTITY

**Design Style:** Dark Premium AI SaaS
**Inspired by:** Linear (structure + precision), Raycast (gradient glow on dark), Perplexity AI (clean AI result layouts), Attio (monochromatic boldness), Huly (dark interface + bright color blocks)
**Personality:** Intelligent · Trustworthy · Fast · Premium · Modern
**Feel:** Like a professional tool that respects the user's time. Not playful. Not corporate. Exactly in between — confident and clean.

---

## 🌗 THEME SYSTEM

CompareIQ uses **dark mode as default** with a light mode toggle.

### Dark Mode (Default)
```
Background Base:        #0A0A0F   (near black — not pure black, avoids harshness)
Background Surface:     #111118   (cards, panels, modals)
Background Elevated:    #1A1A24   (dropdowns, tooltips, hover states)
Border Color:           #2A2A3A   (subtle borders between elements)
Border Accent:          #3A3A5C   (highlighted borders on focus/hover)
```

### Light Mode
```
Background Base:        #F8F8FC
Background Surface:     #FFFFFF
Background Elevated:    #F0F0F8
Border Color:           #E2E2EC
Border Accent:          #C8C8E0
```

---

## 🎨 COLOUR PALETTE

### Primary Brand Colors
```
Brand Purple:           #7C3AED   (primary actions, logo accent, AI badge)
Brand Purple Light:     #8B5CF6   (hover states on primary)
Brand Purple Glow:      rgba(124, 58, 237, 0.15)  (glow effect behind hero elements)
Brand Indigo:           #6366F1   (secondary accent, links, tabs)
```

### Gradient System (Most important — this defines the premium feel)
```
Hero Gradient:          linear-gradient(135deg, #7C3AED 0%, #6366F1 50%, #2DD4BF 100%)
Card Glow Gradient:     radial-gradient(ellipse at top, rgba(124,58,237,0.12) 0%, transparent 70%)
Winner Banner Gradient: linear-gradient(90deg, #7C3AED 0%, #6366F1 100%)
Score Bar Gradient:     linear-gradient(90deg, #6366F1 0%, #2DD4BF 100%)
Text Gradient (hero):   linear-gradient(90deg, #FFFFFF 0%, #A78BFA 60%, #2DD4BF 100%)
```

### Semantic Colors
```
Success / Win:          #10B981   (winner indicator, pros list, positive scores)
Warning / Tie:          #F59E0B   (tie state, medium scores)
Danger / Loss:          #EF4444   (cons list, low scores — use sparingly)
Info / AI:              #2DD4BF   (teal — AI badge, special highlights)
```

### Text Colors (Dark Mode)
```
Text Primary:           #F1F1F5   (headings, important labels)
Text Secondary:         #A0A0BC   (body text, descriptions)
Text Muted:             #606080   (timestamps, meta info, placeholders)
Text Accent:            #A78BFA   (purple-tinted for highlighted text)
```

---

## ✍️ TYPOGRAPHY

**Primary Font:** `Inter` (Google Font — already in project)
**Monospace Font:** `JetBrains Mono` (for product specs, code-like data display)

### Type Scale
```
Display (Hero Title):   72px / font-weight: 800 / letter-spacing: -2px
H1 (Page Title):        48px / font-weight: 700 / letter-spacing: -1px
H2 (Section Title):     32px / font-weight: 700 / letter-spacing: -0.5px
H3 (Card Title):        22px / font-weight: 600
Body Large:             18px / font-weight: 400 / line-height: 1.7
Body:                   16px / font-weight: 400 / line-height: 1.6
Small / Meta:           14px / font-weight: 400 / color: Text Muted
Label / Badge:          12px / font-weight: 600 / letter-spacing: 0.5px / UPPERCASE
Mono (specs):           14px / JetBrains Mono / color: Text Secondary
```

### Typography Rules
- Hero headline uses `Text Gradient` — white fading into purple-teal
- All section titles: bold, no decorative underlines
- Body text always `Text Secondary` color, never pure white (reduces eye strain)
- Use uppercase labels sparingly — only for badges, categories, status chips

---

## 📐 SPACING & LAYOUT

```
Page max-width:         1280px   (centered, generous side padding)
Section padding:        80px top/bottom (desktop), 48px (mobile)
Card padding:           24px
Card gap (grid):        16px
Border radius (cards):  16px
Border radius (buttons): 10px
Border radius (inputs): 10px
Border radius (badges): 6px
Border radius (chips):  999px (pill shape)
```

### Grid System
- **Desktop:** 12-column grid, max 1280px
- **Tablet:** 8-column, 768px–1024px
- **Mobile:** 4-column, single stack below 640px

---

## 🧩 COMPONENT DESIGN SYSTEM

### Buttons

**Primary Button** (main CTA — "Analyze with AI", "Get Started"):
```
Background:     linear-gradient(135deg, #7C3AED, #6366F1)
Text:           #FFFFFF, font-weight: 600
Padding:        14px 28px
Border-radius:  10px
Box-shadow:     0 0 24px rgba(124, 58, 237, 0.35)
Hover:          brightness 1.1 + box-shadow increases to 0 0 32px rgba(124,58,237,0.5)
Active:         scale(0.98)
Transition:     all 0.2s ease
```

**Secondary Button** (ghost style — "View History", "Compare Again"):
```
Background:     transparent
Border:         1px solid #3A3A5C
Text:           #A0A0BC
Padding:        14px 28px
Hover:          Background #1A1A24, border-color #7C3AED, text #F1F1F5
```

**Icon Button** (Share, Delete, small actions):
```
Background:     transparent
Border:         1px solid #2A2A3A
Padding:        10px
Border-radius:  10px
Hover:          background #1A1A24
```

---

### Input Fields

```
Background:         #111118
Border:             1px solid #2A2A3A
Border-radius:      10px
Text color:         #F1F1F5
Placeholder:        #606080
Padding:            14px 16px
Font-size:          16px

Focus state:
  Border:           1px solid #7C3AED
  Box-shadow:       0 0 0 3px rgba(124, 58, 237, 0.15)
  Outline:          none

Dropdown (autocomplete):
  Background:       #1A1A24
  Border:           1px solid #3A3A5C
  Border-radius:    10px
  Item hover:       background #2A2A3A, text #F1F1F5
  Box-shadow:       0 8px 32px rgba(0,0,0,0.5)
```

---

### Cards

**Standard Card:**
```
Background:         #111118
Border:             1px solid #2A2A3A
Border-radius:      16px
Padding:            24px
Hover:              border-color #3A3A5C, box-shadow: 0 0 0 1px #3A3A5C

Gradient glow variant (for featured/hero cards):
  background:       #111118
  border:           1px solid rgba(124, 58, 237, 0.3)
  box-shadow:       0 0 40px rgba(124, 58, 237, 0.08)
  + ::before pseudo radial glow at top
```

**Product Comparison Card (side-by-side):**
```
Winner card gets:
  border:           1px solid rgba(124, 58, 237, 0.5)
  box-shadow:       0 0 32px rgba(124, 58, 237, 0.12)
  top accent bar:   3px solid gradient(#7C3AED → #2DD4BF)

Loser card gets:
  border:           1px solid #2A2A3A
  opacity:          0.85
```

---

### Score Bars (Category Breakdown)

```
Container:
  Background:   #1A1A24
  Height:       8px
  Border-radius: 999px

Fill (Product A):
  Background:   linear-gradient(90deg, #6366F1, #7C3AED)
  Animated:     width from 0 → actual% on mount (0.8s ease-out)

Fill (Product B):
  Background:   linear-gradient(90deg, #2DD4BF, #6366F1)
  Animated:     same animation, 0.1s delay after Product A

Score number:
  Font:         JetBrains Mono, 18px, font-weight: 700
  Color:        #F1F1F5
```

---

### Winner Badge

```
Container:
  Background:   linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)
  Padding:      6px 14px
  Border-radius: 999px
  Box-shadow:   0 0 20px rgba(124, 58, 237, 0.4)

Text:
  Font-size:    13px
  Font-weight:  700
  Color:        #FFFFFF
  Text:         "⚡ WINNER" or "🏆 BEST CHOICE"

Animation on mount:
  scale: 0.8 → 1.0 with spring bounce (Framer Motion: type: "spring", stiffness: 300)
```

---

### AI Badge / Label

```
Background:         rgba(45, 212, 191, 0.1)
Border:             1px solid rgba(45, 212, 191, 0.3)
Text color:         #2DD4BF
Text:               "✦ AI Analysis" or "✦ Powered by GPT-4o"
Font-size:          12px
Font-weight:        600
Padding:            4px 12px
Border-radius:      999px
```

---

### Navbar

```
Background:         rgba(10, 10, 15, 0.8)   (semi-transparent)
Backdrop-filter:    blur(16px)               (frosted glass effect)
Border-bottom:      1px solid #2A2A3A
Height:             64px
Position:           sticky top-0, z-index: 50

Logo:
  Text "CompareIQ"
  Font-weight: 800
  gradient text: #FFFFFF → #A78BFA

Nav links:
  Color: #A0A0BC
  Hover: #F1F1F5
  Active page: #F1F1F5 + tiny bottom border in #7C3AED

CTA Button in nav:
  Use Primary Button style but smaller padding: 10px 20px
```

---

### Sidebar (App Layout)

```
Background:         #0D0D14
Border-right:       1px solid #2A2A3A
Width:              240px (desktop), collapses to icon-only 64px on tablet

Nav items:
  Default:          text #A0A0BC, icon #606080
  Hover:            background #1A1A24, text #F1F1F5
  Active:           background rgba(124,58,237,0.1), 
                    left border: 3px solid #7C3AED,
                    text #F1F1F5, icon #7C3AED
  Border-radius:    8px
  Padding:          10px 12px
```

---

### Status Chips / Badges

```
Tier: FREE
  Background: rgba(96, 96, 128, 0.2), border: 1px solid #606080
  Text: #A0A0BC

Tier: PRO
  Background: rgba(124, 58, 237, 0.15), border: 1px solid rgba(124,58,237,0.4)
  Text: #A78BFA

Category label:
  Background: #1A1A24, border: 1px solid #2A2A3A
  Text: #A0A0BC, uppercase, 12px
```

---

## 🗺️ PAGE-BY-PAGE DESIGN INSTRUCTIONS

---

### PAGE 1 — Landing Page `/`

**Overall vibe:** Raycast-style hero. Dark. Gradient orb glow in background. Bold headline.

**Hero Section:**
- Full viewport height (100vh)
- Centered content
- Behind the headline: a large radial gradient orb — `radial-gradient(ellipse 800px 600px at 50% 40%, rgba(124,58,237,0.18) 0%, transparent 70%)` — blurred 80px. This creates the signature "glow behind text" look.
- AI badge above headline: `✦ AI-Powered Comparison`  (teal badge style from components above)
- Main headline: "Stop Guessing.`<br/>`Start Deciding." — Display size (72px), font-weight 800, `background-clip: text` gradient (white → purple → teal)
- Subheadline: 20px, Text Secondary, max-width 560px, centered
- Two buttons side by side: Primary "Start Comparing Free" + Secondary ghost "See How It Works"
- Below buttons: "No credit card required · 5 free comparisons/month"  in muted text

**How It Works Section:**
- Dark section, 3 cards in a row
- Each card: number badge (01, 02, 03 in purple), icon, title, description
- Cards have border gradient top accent: `border-top: 2px solid linear-gradient`

**Category Showcase:**
- Horizontal scroll row of pill chips: Electronics · Phones · Laptops · Clothing · Home · Sports · Beauty · Appliances
- Each pill: chip style with icon + label, subtle border
- Background: slightly lighter section `#111118`

**Sample Comparison (Hero Demo):**
- A static "frozen" result card showing "iPhone 15 vs Samsung S24 Ultra"
- Winner badge glowing, two mini product cards, partial score bars
- This whole block has a `box-shadow: 0 40px 80px rgba(0,0,0,0.5)` and slight `perspective` CSS tilt
- Above it: label "See a real comparison →"

---

### PAGE 2 & 3 — Auth Pages `/login` and `/register`

**Layout:** Split screen on desktop.
- **Left panel (60%):** Dark background, CompareIQ logo top-left, large headline "Compare smarter. Decide faster.", soft gradient orb background glow, 3 feature bullets with checkmarks
- **Right panel (40%):** Background `#111118`, centered form card with no visible card border, just the form floating

**Form style:**
- Heading: "Create your account" — H2 size, white
- Subtext: "Already have one? Sign in →" — muted with purple link
- Google OAuth button: full width, `#1A1A24` background, Google logo icon, white text "Continue with Google"
- Divider: "— or continue with email —"
- Input fields: use Input component from design system
- Submit button: full width, Primary Button style

---

### PAGE 4 — Dashboard `/dashboard`

**Layout:** Left sidebar (240px) + main content

**Welcome Banner:**
- Not a card — just inline text: "Good morning, Dvarakesh 👋" H1 size
- Subtext: "Ready to compare something?" with inline "Compare Now →" purple link

**Stats Row:**
- 3 cards in a row
- Each stat card: number in Display font (48px), gradient text, label below in muted
- Subtle top-border gradient accent on each card

**Quick Compare Widget:**
- Full-width card with gradient border (`border: 1px solid rgba(124,58,237,0.3)`)
- Two inputs side by side with "VS" badge in center (circular, gradient background)
- "Analyze with AI" button below — full width on mobile, auto width on desktop

**Recent Comparisons:**
- Section title + "View All →" link right-aligned
- Grid of cards (2 columns desktop, 1 mobile)
- Each card: two product names separated by "vs", winner badge, category chip, date, "View →" arrow

---

### PAGE 5 — Compare Input Page `/compare`

**Header:**
- Page title: "Compare Any Two Products" — H1
- Subtitle: "Enter two product names and let AI give you a clear verdict"

**Main Compare Form:**
- Two large search inputs stacked vertically with a floating "VS" divider between them
- Each input: full width, large (56px height), placeholder "e.g. iPhone 15 Pro"
- When user types → dropdown appears with product suggestions: each suggestion shows product name, category chip, price if known
- VS divider: circular badge 48px, gradient background, bold "VS" text, centered horizontally between inputs

**Preferences Panel:**
- Collapsible section below inputs: "Customize your comparison ▾"
- When expanded shows: Budget slider or text input, Priority checkboxes (Performance, Value, Design, Durability, Battery, Features), Use case text area
- Panel background: `#111118`, border `#2A2A3A`

**Compare Button:**
- Full width, 56px height, Primary Button style
- Icon: ✦ sparkle icon (Lucide: `Sparkles`) to the left of text

**Loading State:**
- Replace button + inputs with a centered loading animation
- Text: "✦ AI is analyzing your products..."
- Animated: pulsing gradient glow orb behind text
- Below: 3 skeleton rows fading in and out

---

### PAGE 6 — Comparison Result Page `/compare/[id]`

**This is the most important page — the hero feature.**

**Top bar:**
- Breadcrumb: Dashboard → Compare → Result
- Share button (icon + label) top right
- "New Comparison" ghost button

**Comparison Header:**
- Two product names in large text (H1) separated by "VS" 
- Product A name left-aligned, Product B right-aligned
- "VS" text centered, muted color

**Winner Banner:**
- Full width, gradient background (`#7C3AED → #6366F1`)
- Large trophy icon `🏆`
- "[ProductName] wins this comparison"
- Below: 1-line reason in italic white text
- Entry animation: slide down from above + fade in (Framer Motion)

**AI Summary Card:**
- Card with teal AI badge top-left: "✦ AI Analysis"
- Summary paragraph in Body Large size
- Subtle gradient glow behind card

**Category Breakdown:**
- Section title "How They Compare"
- Each category row:
  - Category name left (bold)
  - Product A score bar — fills left to right
  - Scores in JetBrains Mono
  - Product B score bar — fills right to left
  - Winner tiny badge on winner side
- Animate all bars on page load (staggered, 0.1s delay each)

**Side-by-Side Product Cards:**
- 2 column grid
- Winner card: glowing purple border
- Each card: product image (if available, else placeholder icon), price badge, rating stars, pros list (green ✓), cons list (red ✗), key specs in mono font

**Best For + Recommendation:**
- Two chips below cards: "Product A is best for: [text]" and "Product B is best for: [text]"
- Full recommendation paragraph in a card with left border accent in purple

**Action Bar (sticky bottom on mobile):**
- "Compare Again" ghost button
- "Share Result" primary button
- On desktop: shown at top right, not sticky

---

### PAGE 7 — History Page `/history`

**Header:** "Your Comparisons" H1 + count badge "127 total"

**Filter Bar:**
- Inline row: Search input (half width), Category dropdown, Sort dropdown
- All use same dark input style

**Table (desktop):**
```
Columns: Product A | VS | Product B | Winner | Category | Date | Actions
Row style: background #111118, border-bottom #2A2A3A
Row hover: background #1A1A24
Winner column: shows mini winner badge
Actions: View icon button, Share icon button, Delete icon button (red on hover)
```

**Cards (mobile — below 768px):**
- Full width cards, product names bold, winner badge, date muted, action icons row

**Empty State:**
- Centered illustration (use a simple SVG of two boxes with "?" icons)
- Text: "No comparisons yet" H3 + "Start your first comparison →" primary button

---

### PAGE 8 — Settings Page `/settings`

**Layout:** Left sidebar navigation within the settings panel (vertical tabs: Profile · Preferences · Account · Subscription)

**Profile Section:**
- Avatar circle placeholder with initials
- Name field (editable), Email (readonly with lock icon)
- Save button: primary

**Preferences Section:**
- Default budget input
- Priority multi-select checkboxes (same design as compare page)
- "These will auto-fill your comparison preferences"

**Subscription Section:**
- Current plan card: gradient border, plan name large, feature list, upgrade CTA

**Danger Zone:**
- Separate section at bottom, red-tinted border `1px solid rgba(239,68,68,0.3)`
- "Delete Account" button: red ghost button

---

### PAGE 9 — Public Share Page `/share/[id]`

**Top Banner (conversion bar):**
- Full width banner at very top
- Background: gradient `#7C3AED → #6366F1`
- Text: "Viewing a CompareIQ result · Compare any products for free →"
- Sign up button: white text, white border, right side

**Rest of page:** Identical to `/compare/[id]` result page
- Remove all editing actions
- Show "View on CompareIQ" watermark at bottom

---

## 🎬 ANIMATION GUIDELINES

Use **Framer Motion** for all animations. Rules:

```
Page transitions:
  Initial:    { opacity: 0, y: 10 }
  Animate:    { opacity: 1, y: 0 }
  Transition: { duration: 0.3, ease: "easeOut" }

Cards (staggered list):
  Each card:  same as page transition
  Parent:     staggerChildren: 0.08s

Score bars:
  Initial width: 0%
  Animate to:    actual percentage
  Transition:    { duration: 0.8, ease: "easeOut", delay: index * 0.1 }

Winner badge:
  Initial:    { scale: 0.7, opacity: 0 }
  Animate:    { scale: 1, opacity: 1 }
  Transition: { type: "spring", stiffness: 300, damping: 20 }

Button hover:
  Use CSS transition only (not Framer Motion) — 0.15s ease

Navbar blur:
  CSS backdrop-filter: blur(16px) — no animation needed
```

**Do NOT animate:**
- Text content
- Simple show/hide states (use CSS opacity instead)
- Anything that runs on scroll (avoid for now)

---

## 🚫 DESIGN DON'TS

These are mistakes to strictly avoid:

1. ❌ No pure white `#FFFFFF` backgrounds — always use `#F8F8FC` or the dark palette
2. ❌ No bright blue (`#3B82F6`) as primary — use purple/indigo system defined above
3. ❌ No drop shadows on dark backgrounds — use glow effects (`box-shadow` with rgba color, not black)
4. ❌ No rounded corners above `16px` on cards — use 16px max
5. ❌ No gradient text on body copy — only for Display/H1 hero headlines
6. ❌ No tables inside cards — use clean list rows with border-bottom separators
7. ❌ No full-width purple backgrounds on inner pages — hero gradient only on Landing Page
8. ❌ No more than 3 fonts in the project — Inter + JetBrains Mono only
9. ❌ No emoji in navigation — only in content sections sparingly
10. ❌ No centered body text — only hero headlines and empty states center-aligned

---

## ✅ DESIGN DO'S

1. ✅ Always use `backdrop-filter: blur` on the Navbar
2. ✅ Score bars always animated on mount
3. ✅ Winner card always gets the glowing purple border
4. ✅ Every empty state must have an icon/illustration + action CTA
5. ✅ Use JetBrains Mono for any number data, specs, and scores
6. ✅ Use teal (`#2DD4BF`) to mark anything AI-generated
7. ✅ All interactive elements must have a visible hover state
8. ✅ Mobile: all side-by-side layouts stack vertically below 640px
9. ✅ Loading skeletons must match the exact layout of the content they replace
10. ✅ Use `letter-spacing: -1px` on all headings H1 and above

---

## 📱 RESPONSIVE BREAKPOINTS

```
Mobile:   < 640px    (sm)
Tablet:   640–1024px (md / lg)
Desktop:  > 1024px   (xl)

Key responsive rules:
- Sidebar collapses to bottom tab bar on mobile
- Compare form: two inputs stack vertically on mobile (not side by side)
- Result page: product cards stack vertically on mobile
- History table becomes cards on mobile
- Hero text scales: 72px → 48px → 36px (desktop → tablet → mobile)
```

---

## 🔤 HOW TO USE THIS PROMPT WITH COPILOT

**Session start:**
> "I am redesigning CompareIQ. Here is the complete UI/UX design system: [paste this file]. Apply this design system to [page/component name]. Do not change any logic or API calls — only change the visual design, colors, typography, spacing, and animations."

**Per component:**
> "Redesign the CompareForm component using the design system. Use the dark input style, the VS badge between inputs, the primary button with sparkle icon, and the loading state with pulsing glow."

**Per page:**
> "Redesign the Comparison Result page. Apply: Winner Banner with gradient, animated score bars using Framer Motion, winner card with purple glow border, AI Summary card with teal badge, and the side-by-side product cards layout."

---

*This prompt is the single source of truth for all design decisions in CompareIQ. Every page must follow this system exactly for a consistent, premium product.*
