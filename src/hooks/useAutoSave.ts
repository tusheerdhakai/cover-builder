import { useEffect, useRef, useCallback } from 'react';
import { useTemplateStore } from '../stores/templateStore';
import { storageUtils } from '../utils/storageUtils';

export const useAutoSave = () => {
  const { template } = useTemplateStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveRef = useRef<string>('');

  const saveTemplate = useCallback(() => {
    const templateString = JSON.stringify(template);
    
    // Only save if template has actually changed
    if (templateString !== lastSaveRef.current) {
      storageUtils.saveTemplate(template);
      storageUtils.saveCurrentTemplate(template);
      lastSaveRef.current = templateString;
      
      // Also save to auto-save if enabled
      const settings = storageUtils.getSettings();
      if (settings.autoSave) {
        storageUtils.saveAutoSave(template);
      }
    }
  }, [template]);

  useEffect(() => {
    const settings = storageUtils.getSettings();
    
    if (settings.autoSave) {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new interval
      intervalRef.current = setInterval(saveTemplate, settings.autoSaveInterval * 1000);
      
      // Save immediately on mount
      saveTemplate();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [saveTemplate]);

  // Save on window beforeunload
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveTemplate();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveTemplate]);

  return {
    saveTemplate,
    isAutoSaveEnabled: storageUtils.getSettings().autoSave,
  };
}; 