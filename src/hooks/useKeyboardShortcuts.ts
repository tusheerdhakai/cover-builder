import { useEffect } from 'react';
import { useTemplateStore } from '../stores/templateStore';
import { useHistoryStore } from '../stores/historyStore';

export const useKeyboardShortcuts = () => {
  const { undo, redo } = useTemplateStore();
  const { canUndo, canRedo } = useHistoryStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Undo: Ctrl+Z (or Cmd+Z on Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) {
          undo();
        }
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z (or Cmd+Y/Cmd+Shift+Z on Mac)
      if ((event.ctrlKey || event.metaKey) && 
          (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        if (canRedo()) {
          redo();
        }
      }

      // Delete selected layer: Delete or Backspace
      if (event.key === 'Delete' || event.key === 'Backspace') {
        // This could be implemented to delete the selected layer
        // For now, we'll just prevent the default behavior
        event.preventDefault();
      }

      // Escape: Deselect layer
      if (event.key === 'Escape') {
        // This could be implemented to deselect the current layer
        // For now, we'll just prevent the default behavior
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);
}; 