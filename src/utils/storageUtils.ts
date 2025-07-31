import type { Template } from '../types/template';

const STORAGE_KEYS = {
  TEMPLATES: 'email_maker_templates',
  CURRENT_TEMPLATE: 'email_maker_current_template',
  AUTO_SAVE: 'email_maker_auto_save',
  SETTINGS: 'email_maker_settings',
} as const;

export interface StorageSettings {
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  maxAutoSaves: number;
}

const DEFAULT_SETTINGS: StorageSettings = {
  autoSave: true,
  autoSaveInterval: 30,
  maxAutoSaves: 10,
};

export const storageUtils = {
  // Template management
  saveTemplate: (template: Template): void => {
    try {
      const templates = storageUtils.getAllTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  },

  getTemplate: (id: string): Template | null => {
    try {
      const templates = storageUtils.getAllTemplates();
      return templates.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Failed to get template:', error);
      return null;
    }
  },

  getAllTemplates: (): Template[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get all templates:', error);
      return [];
    }
  },

  deleteTemplate: (id: string): void => {
    try {
      const templates = storageUtils.getAllTemplates();
      const filteredTemplates = templates.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(filteredTemplates));
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  },

  // Auto-save management
  saveAutoSave: (template: Template): void => {
    try {
      const autoSaves = storageUtils.getAutoSaves();
      const timestamp = new Date().toISOString();
      
      autoSaves.push({
        template,
        timestamp,
        id: `${template.id}_${timestamp}`,
      });
      
      // Keep only the latest auto-saves
      const settings = storageUtils.getSettings();
      if (autoSaves.length > settings.maxAutoSaves) {
        autoSaves.splice(0, autoSaves.length - settings.maxAutoSaves);
      }
      
      localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(autoSaves));
    } catch (error) {
      console.error('Failed to save auto-save:', error);
    }
  },

  getAutoSaves: (): Array<{ template: Template; timestamp: string; id: string }> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get auto-saves:', error);
      return [];
    }
  },

  getLatestAutoSave: (templateId: string): Template | null => {
    try {
      const autoSaves = storageUtils.getAutoSaves();
      const templateAutoSaves = autoSaves
        .filter(save => save.template.id === templateId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return templateAutoSaves.length > 0 ? templateAutoSaves[0].template : null;
    } catch (error) {
      console.error('Failed to get latest auto-save:', error);
      return null;
    }
  },

  clearAutoSaves: (templateId?: string): void => {
    try {
      if (templateId) {
        const autoSaves = storageUtils.getAutoSaves();
        const filteredAutoSaves = autoSaves.filter(save => save.template.id !== templateId);
        localStorage.setItem(STORAGE_KEYS.AUTO_SAVE, JSON.stringify(filteredAutoSaves));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTO_SAVE);
      }
    } catch (error) {
      console.error('Failed to clear auto-saves:', error);
    }
  },

  // Settings management
  saveSettings: (settings: Partial<StorageSettings>): void => {
    try {
      const currentSettings = storageUtils.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  getSettings: (): StorageSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Current template management
  saveCurrentTemplate: (template: Template): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_TEMPLATE, JSON.stringify(template));
    } catch (error) {
      console.error('Failed to save current template:', error);
    }
  },

  getCurrentTemplate: (): Template | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_TEMPLATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current template:', error);
      return null;
    }
  },

  // Utility functions
  clearAllData: (): void => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear all data:', error);
    }
  },

  getStorageSize: (): number => {
    try {
      let totalSize = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          totalSize += new Blob([data]).size;
        }
      });
      return totalSize;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  },
}; 