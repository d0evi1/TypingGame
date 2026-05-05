# 打字星球 (Typing Planet) - AGENTS.md

A children's typing practice tool inspired by type.fun. Single-player, offline-first React app.

## Commands

```bash
npm run dev      # Start Vite dev server (may need --host 127.0.0.1 on some networks)
npm run build    # tsc -b && vite build (typecheck first, then build)
npm run lint     # ESLint with typescript-eslint, react-hooks, react-refresh
npm run preview  # Preview production build from dist/
```

## Tech Stack

- React 19 + TypeScript 6 + Vite 8
- Tailwind 4 via `@tailwindcss/vite` plugin (imports in index.css as `@import "tailwindcss"`)
- Zustand 5 with persist middleware (localStorage key: `typing-game-storage`)
- Framer Motion 12 for animations
- Howler.js for sound effects

## Architecture

**Page Routing**: Simple `useState<'home'|'practice'|'courses'|'lessons'|'stats'>` in App.tsx. No router library used despite react-router-dom in dependencies.

**State Management**: 
- `src/store/gameStore.ts` - Zustand store with `persist` middleware
- `useCurrentProfile()` - derived hook for active profile lookup
- Stores: `currentProfileId`, `profiles[]`, `settings`

**Core Game Logic**: 
- `src/hooks/useTypingGame.ts` - encapsulates all typing mechanics
- Uses `window.addEventListener('keydown')` for global key capture
- Tracks: currentIndex, correctChars, wrongChars, combo, mistakes Map
- Key format for mistakes: `"expected->actual"` (e.g., `"a->s"`)

**Component Structure**:
- `src/components/game/TypingPractice.tsx` - main practice UI, uses VirtualKeyboard + useTypingGame
- `src/components/profile/ProfileSelect.tsx` - profile selection + HomePage (same file)
- `src/components/courses/` - CourseList and LessonList
- `src/components/keyboard/VirtualKeyboard.tsx` - on-screen QWERTY keyboard

**Data Files**:
- `src/data/courses.ts` - 4 courses with lessons (basics, speed, Python, JavaScript)
- `src/data/keyboardLayout.ts` - QWERTY layout with finger-color mapping

## Key Files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Page state machine, navigation callbacks |
| `src/types/index.ts` | All TypeScript interfaces (Profile, Course, Lesson, TypingState, etc.) |
| `src/hooks/useTypingGame.ts` | Core typing logic - keystroke detection, WPM/accuracy calculation |
| `src/store/gameStore.ts` | Zustand store with persistence |
| `src/data/courses.ts` | Static course/lesson content |

## Non-Obvious Patterns

**Sound Files**: Expected at `/public/sounds/` - `correct.mp3`, `wrong.mp3`, `combo.mp3`, `complete.mp3`, `fail.mp3`, `click.mp3`. Currently not present.

**Experience System**: EXP gain = `floor(WPM * accuracy / 100)`. Level = `floor(totalEXP / 100) + 1`.

**Finger Colors**: Each finger mapped to color in `keyboardLayout.ts`:
- left-pinky: red, left-ring: orange, left-middle: yellow, left-index: green
- right-index: cyan, right-middle: blue, right-ring: purple, right-pinky: pink

**CSS Variables**: Theme colors defined in `src/index.css` as `:root` custom properties (--primary, --surface, etc.)

**Chinese UI**: All labels in Chinese (打字星球, 键位指法入门, 课程学习, etc.)

## Conventions

- Zustand selectors use arrow functions: `useGameStore((s) => s.profiles)`
- Framer Motion's `AnimatePresence` for page transitions
- CSS class `.typing-font` applies JetBrains Mono for practice text
- Profile IDs: `profile-${timestamp}-${random}`

## Dependencies Not Yet Used

- `dexie` - IndexedDB wrapper (planned for better offline storage)
- `react-router-dom` - in package.json but no router implemented
- `recharts` - for statistics visualization (basic stats page exists)