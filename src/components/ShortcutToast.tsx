import React from 'react';
import { Sparkles, Gamepad2, Volume2, VolumeX, Moon, Sun, Home, Layers, Trophy, Info } from 'lucide-react';
import { ShortcutActionType } from '../utils/keyboardShortcuts.ts';

export interface ShortcutNotification {
  id: number;
  message: string;
  type: ShortcutActionType;
  label: string;
}

interface ShortcutToastProps {
  notification: ShortcutNotification | null;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({ notification }) => {
  if (!notification) return null;

  const renderIcon = () => {
    switch (notification.type) {
      case 'launch_game':
        return <Gamepad2 className="w-4 h-4 text-indigo-400" />;
      case 'toggle_mute':
        return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'toggle_theme':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'navigate':
        return <Home className="w-4 h-4 text-purple-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#0d142d]/95 border border-indigo-500/40 shadow-2xl backdrop-blur-md text-white text-xs">
        <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/50">
          {renderIcon()}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-200">{notification.message}</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 font-mono text-[10px] text-indigo-300 font-bold shadow-sm">
            {notification.label}
          </kbd>
        </div>
      </div>
    </div>
  );
};
