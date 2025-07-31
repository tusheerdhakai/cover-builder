import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  action: string;
  shortcut: string;
  description: string;
  category: 'general' | 'editing' | 'navigation' | 'file';
}

const shortcuts: ShortcutItem[] = [
  // General
  {
    action: 'Undo',
    shortcut: 'Ctrl+Z',
    description: 'Undo the last action',
    category: 'general',
  },
  {
    action: 'Redo',
    shortcut: 'Ctrl+Y',
    description: 'Redo the last undone action',
    category: 'general',
  },
  {
    action: 'Save',
    shortcut: 'Ctrl+S',
    description: 'Save the current template',
    category: 'general',
  },
  {
    action: 'Preview',
    shortcut: 'Ctrl+P',
    description: 'Open preview mode',
    category: 'general',
  },
  
  // Editing
  {
    action: 'Delete Layer',
    shortcut: 'Delete',
    description: 'Delete the selected layer',
    category: 'editing',
  },
  {
    action: 'Duplicate Layer',
    shortcut: 'Ctrl+D',
    description: 'Duplicate the selected layer',
    category: 'editing',
  },
  {
    action: 'Select All',
    shortcut: 'Ctrl+A',
    description: 'Select all layers',
    category: 'editing',
  },
  {
    action: 'Copy',
    shortcut: 'Ctrl+C',
    description: 'Copy the selected layer',
    category: 'editing',
  },
  {
    action: 'Paste',
    shortcut: 'Ctrl+V',
    description: 'Paste the copied layer',
    category: 'editing',
  },
  
  // Navigation
  {
    action: 'Deselect',
    shortcut: 'Escape',
    description: 'Deselect the current layer',
    category: 'navigation',
  },
  {
    action: 'Next Layer',
    shortcut: 'Tab',
    description: 'Select the next layer',
    category: 'navigation',
  },
  {
    action: 'Previous Layer',
    shortcut: 'Shift+Tab',
    description: 'Select the previous layer',
    category: 'navigation',
  },
  
  // File
  {
    action: 'New Template',
    shortcut: 'Ctrl+N',
    description: 'Create a new template',
    category: 'file',
  },
  {
    action: 'Open Library',
    shortcut: 'Ctrl+O',
    description: 'Open template library',
    category: 'file',
  },
  {
    action: 'Export HTML',
    shortcut: 'Ctrl+E',
    description: 'Export as HTML',
    category: 'file',
  },
];

const categoryLabels = {
  general: 'General',
  editing: 'Editing',
  navigation: 'Navigation',
  file: 'File Operations',
};

const formatShortcut = (shortcut: string) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  return shortcut
    .replace('Ctrl+', isMac ? '⌘' : 'Ctrl+')
    .replace('Cmd+', isMac ? '⌘' : 'Ctrl+')
    .replace('Alt+', isMac ? '⌥' : 'Alt+')
    .replace('Shift+', isMac ? '⇧' : 'Shift+');
};

export const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h3>
                
                <div className="space-y-3">
                  {categoryShortcuts.map((shortcut) => (
                    <div key={shortcut.action} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{shortcut.action}</div>
                        <div className="text-sm text-gray-600">{shortcut.description}</div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-4">
                        {shortcut.shortcut.split('+').map((key, index) => (
                          <React.Fragment key={index}>
                            {index > 0 && <span className="text-gray-400">+</span>}
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                              {formatShortcut(key)}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Command className="w-4 h-4" />
              <span>
                {navigator.platform.toUpperCase().indexOf('MAC') >= 0 
                  ? 'Mac shortcuts shown' 
                  : 'Windows/Linux shortcuts shown'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 