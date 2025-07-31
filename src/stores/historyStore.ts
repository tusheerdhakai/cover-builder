import { create } from 'zustand';
import type { Template } from '../types/template';

interface HistoryState {
  past: Template[];
  present: Template | null;
  future: Template[];
  
  // Actions
  pushState: (template: Template) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],

  pushState: (template: Template) => {
    const { past, present } = get();
    
    if (present && JSON.stringify(present) === JSON.stringify(template)) {
      return; // No change
    }

    const newPast = present ? [...past, present] : past;
    
    // Limit history size
    if (newPast.length > MAX_HISTORY_SIZE) {
      newPast.shift();
    }

    set({
      past: newPast,
      present: template,
      future: [], // Clear future when new action is performed
    });
  },

  undo: () => {
    const { past, present, future } = get();
    
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    const newFuture = present ? [present, ...future] : future;

    set({
      past: newPast,
      present: previous,
      future: newFuture,
    });
  },

  redo: () => {
    const { past, present, future } = get();
    
    if (future.length === 0) return;

    const next = future[0];
    const newFuture = future.slice(1);
    const newPast = present ? [...past, present] : past;

    set({
      past: newPast,
      present: next,
      future: newFuture,
    });
  },

  canUndo: () => {
    return get().past.length > 0;
  },

  canRedo: () => {
    return get().future.length > 0;
  },

  clearHistory: () => {
    set({
      past: [],
      present: null,
      future: [],
    });
  },
})); 