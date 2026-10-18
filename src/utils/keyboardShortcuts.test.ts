import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveKeyboardShortcut,
  GAME_KEY_MAP,
  SHORTCUT_DEFINITIONS
} from './keyboardShortcuts.ts';

test('resolveKeyboardShortcut: launches games 1 through 7', () => {
  const expectedGames = [
    { key: '1', view: 'tictactoe' },
    { key: '2', view: 'sudoku' },
    { key: '3', view: 'rps' },
    { key: '4', view: 'maze' },
    { key: '5', view: 'connect4' },
    { key: '6', view: '2048' },
    { key: '7', view: 'hangman' },
  ];

  for (const { key, view } of expectedGames) {
    const res = resolveKeyboardShortcut(key, { currentView: 'home' });
    assert.ok(res !== null, `Shortcut for ${key} should resolve`);
    assert.equal(res?.type, 'launch_game');
    assert.equal(res?.targetView, view);
    assert.equal(res?.label, key);
  }
});

test('resolveKeyboardShortcut: toggles mute with M / m', () => {
  const resUpper = resolveKeyboardShortcut('M', { currentView: 'home' });
  assert.equal(resUpper?.type, 'toggle_mute');

  const resLower = resolveKeyboardShortcut('m', { currentView: 'games' });
  assert.equal(resLower?.type, 'toggle_mute');
});

test('resolveKeyboardShortcut: toggles dark mode with D / d', () => {
  const resUpper = resolveKeyboardShortcut('D', { currentView: 'home' });
  assert.equal(resUpper?.type, 'toggle_theme');

  const resLower = resolveKeyboardShortcut('d', { currentView: 'tictactoe' });
  assert.equal(resLower?.type, 'toggle_theme');
});

test('resolveKeyboardShortcut: handles navigation H, G, L, A', () => {
  assert.equal(resolveKeyboardShortcut('h')?.targetView, 'home');
  assert.equal(resolveKeyboardShortcut('g')?.targetView, 'games');
  assert.equal(resolveKeyboardShortcut('l')?.targetView, 'leaderboard');
  assert.equal(resolveKeyboardShortcut('a')?.targetView, 'about');
});

test('resolveKeyboardShortcut: does not trigger navigation letters inside Hangman', () => {
  // In Hangman, pressing 'a', 'h', etc. should not navigate away from the game
  const resH = resolveKeyboardShortcut('h', { currentView: 'hangman' });
  assert.equal(resH, null);

  const resA = resolveKeyboardShortcut('a', { currentView: 'hangman' });
  assert.equal(resA, null);

  // But '1' (launching another game) and 'M' (mute) should still work
  const res1 = resolveKeyboardShortcut('1', { currentView: 'hangman' });
  assert.equal(res1?.type, 'launch_game');

  const resM = resolveKeyboardShortcut('m', { currentView: 'hangman' });
  assert.equal(resM?.type, 'toggle_mute');
});

test('resolveKeyboardShortcut: ignores keys when typing in input or when modifier key held', () => {
  const resTyping = resolveKeyboardShortcut('1', { isEditingText: true });
  assert.equal(resTyping, null);

  const resCtrl = resolveKeyboardShortcut('d', { hasModifier: true });
  assert.equal(resCtrl, null);
});

test('resolveKeyboardShortcut: handles Escape to go home or close modal', () => {
  const resModal = resolveKeyboardShortcut('Escape', { isModalOpen: true });
  assert.equal(resModal?.type, 'back_to_home');

  const resGame = resolveKeyboardShortcut('Escape', { currentView: 'tictactoe' });
  assert.equal(resGame?.type, 'navigate');
  assert.equal(resGame?.targetView, 'home');

  const resHome = resolveKeyboardShortcut('Escape', { currentView: 'home', isModalOpen: false });
  assert.equal(resHome, null);
});

test('resolveKeyboardShortcut: handles ? for shortcuts guide', () => {
  const res = resolveKeyboardShortcut('?');
  assert.equal(res?.type, 'open_shortcuts_modal');
});

test('SHORTCUT_DEFINITIONS: covers all 7 games and core controls', () => {
  assert.ok(SHORTCUT_DEFINITIONS.length >= 12);
  const keys = SHORTCUT_DEFINITIONS.map(s => s.key);
  assert.ok(keys.includes('1'));
  assert.ok(keys.includes('7'));
  assert.ok(keys.includes('M'));
  assert.ok(keys.includes('D'));
});
