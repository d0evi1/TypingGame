import type { KeyboardKey, Finger } from '../types'

export type KeyboardLayout = {
  name: string
  rows: KeyboardKey[][]
}

const fingerColors: Record<Finger, string> = {
  'left-pinky': '#ef4444',
  'left-ring': '#f97316',
  'left-middle': '#eab308',
  'left-index': '#22c55e',
  'right-index': '#06b6d4',
  'right-middle': '#3b82f6',
  'right-ring': '#8b5cf6',
  'right-pinky': '#ec4899',
  'thumb': '#6b7280',
}

export function getFingerColor(finger: Finger): string {
  return fingerColors[finger]
}

export const qwertyLayout: KeyboardLayout = {
  name: 'QWERTY',
  rows: [
    [
      { key: '`', code: 'Backquote', finger: 'left-pinky', row: 0, column: 0 },
      { key: '1', code: 'Digit1', finger: 'left-pinky', row: 0, column: 1 },
      { key: '2', code: 'Digit2', finger: 'left-ring', row: 0, column: 2 },
      { key: '3', code: 'Digit3', finger: 'left-middle', row: 0, column: 3 },
      { key: '4', code: 'Digit4', finger: 'left-index', row: 0, column: 4 },
      { key: '5', code: 'Digit5', finger: 'left-index', row: 0, column: 5 },
      { key: '6', code: 'Digit6', finger: 'right-index', row: 0, column: 6 },
      { key: '7', code: 'Digit7', finger: 'right-index', row: 0, column: 7 },
      { key: '8', code: 'Digit8', finger: 'right-middle', row: 0, column: 8 },
      { key: '9', code: 'Digit9', finger: 'right-ring', row: 0, column: 9 },
      { key: '0', code: 'Digit0', finger: 'right-pinky', row: 0, column: 10 },
      { key: '-', code: 'Minus', finger: 'right-pinky', row: 0, column: 11 },
      { key: '=', code: 'Equal', finger: 'right-pinky', row: 0, column: 12 },
      { key: 'Back', code: 'Backspace', finger: 'right-pinky', row: 0, column: 13, isSpecial: true, width: 2 },
    ],
    [
      { key: 'Tab', code: 'Tab', finger: 'left-pinky', row: 1, column: 0, isSpecial: true, width: 1.5 },
      { key: 'q', code: 'KeyQ', finger: 'left-pinky', row: 1, column: 1 },
      { key: 'w', code: 'KeyW', finger: 'left-ring', row: 1, column: 2 },
      { key: 'e', code: 'KeyE', finger: 'left-middle', row: 1, column: 3 },
      { key: 'r', code: 'KeyR', finger: 'left-index', row: 1, column: 4 },
      { key: 't', code: 'KeyT', finger: 'left-index', row: 1, column: 5 },
      { key: 'y', code: 'KeyY', finger: 'right-index', row: 1, column: 6 },
      { key: 'u', code: 'KeyU', finger: 'right-index', row: 1, column: 7 },
      { key: 'i', code: 'KeyI', finger: 'right-middle', row: 1, column: 8 },
      { key: 'o', code: 'KeyO', finger: 'right-ring', row: 1, column: 9 },
      { key: 'p', code: 'KeyP', finger: 'right-pinky', row: 1, column: 10 },
      { key: '[', code: 'BracketLeft', finger: 'right-pinky', row: 1, column: 11 },
      { key: ']', code: 'BracketRight', finger: 'right-pinky', row: 1, column: 12 },
      { key: '\\', code: 'Backslash', finger: 'right-pinky', row: 1, column: 13, width: 1.5 },
    ],
    [
      { key: 'Caps', code: 'CapsLock', finger: 'left-pinky', row: 2, column: 0, isSpecial: true, width: 1.75 },
      { key: 'a', code: 'KeyA', finger: 'left-pinky', row: 2, column: 1 },
      { key: 's', code: 'KeyS', finger: 'left-ring', row: 2, column: 2 },
      { key: 'd', code: 'KeyD', finger: 'left-middle', row: 2, column: 3 },
      { key: 'f', code: 'KeyF', finger: 'left-index', row: 2, column: 4 },
      { key: 'g', code: 'KeyG', finger: 'left-index', row: 2, column: 5 },
      { key: 'h', code: 'KeyH', finger: 'right-index', row: 2, column: 6 },
      { key: 'j', code: 'KeyJ', finger: 'right-index', row: 2, column: 7 },
      { key: 'k', code: 'KeyK', finger: 'right-middle', row: 2, column: 8 },
      { key: 'l', code: 'KeyL', finger: 'right-ring', row: 2, column: 9 },
      { key: ';', code: 'Semicolon', finger: 'right-pinky', row: 2, column: 10 },
      { key: "'", code: 'Quote', finger: 'right-pinky', row: 2, column: 11 },
      { key: 'Enter', code: 'Enter', finger: 'right-pinky', row: 2, column: 12, isSpecial: true, width: 2.25 },
    ],
    [
      { key: 'Shift', code: 'ShiftLeft', finger: 'left-pinky', row: 3, column: 0, isSpecial: true, width: 2.25 },
      { key: 'z', code: 'KeyZ', finger: 'left-pinky', row: 3, column: 1 },
      { key: 'x', code: 'KeyX', finger: 'left-ring', row: 3, column: 2 },
      { key: 'c', code: 'KeyC', finger: 'left-middle', row: 3, column: 3 },
      { key: 'v', code: 'KeyV', finger: 'left-index', row: 3, column: 4 },
      { key: 'b', code: 'KeyB', finger: 'left-index', row: 3, column: 5 },
      { key: 'n', code: 'KeyN', finger: 'right-index', row: 3, column: 6 },
      { key: 'm', code: 'KeyM', finger: 'right-index', row: 3, column: 7 },
      { key: ',', code: 'Comma', finger: 'right-middle', row: 3, column: 8 },
      { key: '.', code: 'Period', finger: 'right-ring', row: 3, column: 9 },
      { key: '/', code: 'Slash', finger: 'right-pinky', row: 3, column: 10 },
      { key: 'Shift', code: 'ShiftRight', finger: 'right-pinky', row: 3, column: 11, isSpecial: true, width: 2.75 },
    ],
    [
      { key: 'Ctrl', code: 'ControlLeft', finger: 'left-pinky', row: 4, column: 0, isSpecial: true, width: 1.25 },
      { key: 'Win', code: 'MetaLeft', finger: 'left-pinky', row: 4, column: 1, isSpecial: true, width: 1.25 },
      { key: 'Alt', code: 'AltLeft', finger: 'left-pinky', row: 4, column: 2, isSpecial: true, width: 1.25 },
      { key: 'Space', code: 'Space', finger: 'thumb', row: 4, column: 3, isSpecial: true, width: 6.25 },
      { key: 'Alt', code: 'AltRight', finger: 'right-pinky', row: 4, column: 4, isSpecial: true, width: 1.25 },
      { key: 'Win', code: 'MetaRight', finger: 'right-pinky', row: 4, column: 5, isSpecial: true, width: 1.25 },
      { key: 'Menu', code: 'ContextMenu', finger: 'right-pinky', row: 4, column: 6, isSpecial: true, width: 1.25 },
      { key: 'Ctrl', code: 'ControlRight', finger: 'right-pinky', row: 4, column: 7, isSpecial: true, width: 1.25 },
    ],
  ],
}

export function findKeyByChar(char: string): KeyboardKey | null {
  const lowerChar = char.toLowerCase()
  
  for (const row of qwertyLayout.rows) {
    for (const key of row) {
      if (key.key.toLowerCase() === lowerChar) {
        return key
      }
    }
  }
  
  return null
}

export function getShiftedKey(key: KeyboardKey): string {
  const shiftMap: Record<string, string> = {
    '`': '~',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '"',
    ',': '<',
    '.': '>',
    '/': '?',
  }
  
  if (key.key.length === 1 && key.key.match(/[a-z]/i)) {
    return key.key.toUpperCase()
  }
  
  return shiftMap[key.key] || key.key
}