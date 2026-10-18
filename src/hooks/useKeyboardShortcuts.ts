import { useEffect, useState, useCallback, useRef } from 'react';
import { ActiveView } from '../types/index.ts';
import { soundManager } from '../utils/audio.ts';
import { resolveKeyboardShortcut, GAME_NAME_MAP } from '../utils/keyboardShortcuts.ts';
import { ShortcutNotification } from '../components/ShortcutToast.tsx';

interface UseKeyboardShortcutsProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isShortcutsModalOpen: boolean;
  setIsShortcutsModalOpen: (open: boolean) => void;
}

export function useKeyboardShortcuts({
  activeView,
  setActiveView,
  isDark,
  setIsDark,
  isMuted,
  setIsMuted,
  isShortcutsModalOpen,
  setIsShortcutsModalOpen,
}: UseKeyboardShortcutsProps) {
  const [notification, setNotification] = useState<ShortcutNotification | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showNotification = useCallback((message: string, type: any, label: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setNotification({
      id: Date.now(),
      message,
      type,
      label,
    });
    toastTimeoutRef.current = window.setTimeout(() => {
      setNotification(null);
    }, 2200);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditingText = Boolean(
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable
        )
      );

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      const resolved = resolveKeyboardShortcut(e.key, {
        isEditingText,
        hasModifier,
        currentView: activeView,
        isModalOpen: isShortcutsModalOpen,
      });

      if (!resolved) return;

      // Handle the resolved shortcut
      switch (resolved.type) {
        case 'launch_game': {
          if (resolved.targetView) {
            e.preventDefault();
            soundManager.playClick();
            setActiveView(resolved.targetView);
            showNotification(`Launched ${GAME_NAME_MAP[resolved.targetView]}`, 'launch_game', resolved.label);
          }
          break;
        }

        case 'toggle_mute': {
          e.preventDefault();
          const nextMuted = !isMuted;
          soundManager.setMuted(nextMuted);
          setIsMuted(nextMuted);
          if (!nextMuted) {
            soundManager.playClick();
          }
          showNotification(nextMuted ? 'Sound Muted' : 'Sound Enabled', 'toggle_mute', 'M');
          break;
        }

        case 'toggle_theme': {
          e.preventDefault();
          soundManager.playClick();
          const nextDark = !isDark;
          setIsDark(nextDark);
          showNotification(nextDark ? 'Dark Mode' : 'Light Mode', 'toggle_theme', 'D');
          break;
        }

        case 'navigate': {
          if (resolved.targetView) {
            e.preventDefault();
            soundManager.playClick();
            setActiveView(resolved.targetView);
            showNotification(`Navigated to ${GAME_NAME_MAP[resolved.targetView]}`, 'navigate', resolved.label);
          }
          break;
        }

        case 'open_shortcuts_modal': {
          e.preventDefault();
          soundManager.playClick();
          setIsShortcutsModalOpen(!isShortcutsModalOpen);
          break;
        }

        case 'back_to_home': {
          e.preventDefault();
          soundManager.playClick();
          if (isShortcutsModalOpen) {
            setIsShortcutsModalOpen(false);
          } else {
            setActiveView('home');
            showNotification('Returned to Arcade Home', 'navigate', 'Esc');
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeView,
    setActiveView,
    isDark,
    setIsDark,
    isMuted,
    setIsMuted,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    showNotification,
  ]);

  return { notification };
}
