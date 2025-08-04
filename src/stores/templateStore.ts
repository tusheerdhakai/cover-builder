import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Template, Section, Row, Component, ViewMode } from '../types/template';
import type { ComponentType } from '../types/components';
import { DEFAULT_TEMPLATE_SETTINGS } from '../constants/defaultProperties';
import { COMPONENT_CONFIGS } from '../constants/componentTypes';
import { useHistoryStore } from './historyStore';

interface TemplateState {
  template: Template;
  selectedSectionId: string | null;
  selectedRowId: string | null;
  selectedComponentId: string | null;
  hoveredItemId: string | null;
  hoveredItemType: 'section' | 'row' | 'column' | 'component' | null;
  viewMode: ViewMode;
  
  // Actions
  initializeTemplate: () => void;
  
  // Section actions
  addSection: (viewMode: ViewMode, atIndex?: number) => void;
  removeSection: (sectionId: string, viewMode: ViewMode) => void;
  updateSection: (sectionId: string, updates: Partial<Section>, viewMode: ViewMode) => void;
  selectSection: (sectionId: string | null) => void;
  moveSection: (sectionId: string, newIndex: number, viewMode: ViewMode) => void;
  duplicateSection: (sectionId: string, viewMode: ViewMode) => void;
  toggleSectionVisibility: (sectionId: string, viewMode: ViewMode) => void;
  toggleSectionLock: (sectionId: string, viewMode: ViewMode) => void;
  
  // Row actions
  addRow: (sectionId: string, viewMode: ViewMode) => void;
  removeRow: (sectionId: string, rowId: string, viewMode: ViewMode) => void;
  updateRow: (sectionId: string, rowId: string, updates: Partial<Row>, viewMode: ViewMode) => void;
  selectRow: (rowId: string | null) => void;
  moveRow: (sectionId: string, rowId: string, newIndex: number, viewMode: ViewMode) => void;
  duplicateRow: (sectionId: string, rowId: string, viewMode: ViewMode) => void;
  toggleRowVisibility: (sectionId: string, rowId: string, viewMode: ViewMode) => void;
  toggleRowLock: (sectionId: string, rowId: string, viewMode: ViewMode) => void;
  
  // Component actions
  addComponentToSection: (sectionId: string, type: ComponentType, viewMode: ViewMode) => void;
  addComponentToColumn: (sectionId: string, rowId: string, columnIndex: number, type: ComponentType, viewMode: ViewMode) => void;
  addRowTemplate: (sectionId: string, rowTemplate: unknown, viewMode: ViewMode) => void;
  removeComponent: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => void;
  updateComponent: (sectionId: string, rowId: string, componentId: string, updates: Partial<Component>, viewMode: ViewMode) => void;
  selectComponent: (componentId: string | null) => void;
  moveComponent: (sectionId: string, rowId: string, componentId: string, newIndex: number, viewMode: ViewMode) => void;
  duplicateComponent: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => void;
  toggleComponentVisibility: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => void;
  toggleComponentLock: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => void;
  
  // General actions
  setViewMode: (mode: ViewMode) => void;
  setHoveredItem: (id: string | null, type: 'section' | 'row' | 'column' | 'component' | null) => void;
  undo: () => void;
  redo: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => {
  return {
    template: {
      id: uuidv4(),
      name: 'New Template',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: DEFAULT_TEMPLATE_SETTINGS,
      views: {
        desktop: { sections: [] },
        mobile: { sections: [] },
      },
    },
    selectedSectionId: null,
    selectedRowId: null,
    selectedComponentId: null,
    hoveredItemId: null,
    hoveredItemType: null,
    viewMode: 'desktop',

    initializeTemplate: () => {
      set({
        template: {
          id: uuidv4(),
          name: 'New Template',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: DEFAULT_TEMPLATE_SETTINGS,
          views: {
            desktop: { sections: [] },
            mobile: { sections: [] },
          },
        },
        selectedSectionId: null,
        selectedRowId: null,
        selectedComponentId: null,
        hoveredItemId: null,
        hoveredItemType: null,
        viewMode: 'desktop',
      });
    },

    // Section actions
    addSection: (viewMode: ViewMode, atIndex?: number) => {
      const newSection: Section = {
        id: uuidv4(),
        name: `Section ${get().template.views[viewMode].sections.length + 1}`,
        visible: true,
        locked: false,
        rows: [],
        properties: {
          padding: '0px',
          margin: '0px',
          backgroundColor: 'transparent',
        },
      };

      set((state) => {
        const sections = [...state.template.views[viewMode].sections];
        if (atIndex !== undefined && atIndex >= 0 && atIndex <= sections.length) {
          sections.splice(atIndex, 0, newSection);
        } else {
          sections.push(newSection);
        }

        return {
          template: {
            ...state.template,
            views: { ...state.template.views, [viewMode]: { ...state.template.views[viewMode], sections } },
            updatedAt: new Date().toISOString(),
          },
          selectedSectionId: newSection.id,
          selectedRowId: null,
          selectedComponentId: null,
        };
      });
    },

    removeSection: (sectionId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.filter(
                (section) => section.id !== sectionId
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        selectedRowId: null,
        selectedComponentId: null,
      }));
    },

    updateSection: (sectionId: string, updates: Partial<Section>, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId ? { ...section, ...updates } : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    selectSection: (sectionId: string | null) => {
      set({ 
        selectedSectionId: sectionId,
        selectedRowId: null,
        selectedComponentId: null,
      });
    },

    moveSection: (sectionId: string, newIndex: number, viewMode: ViewMode) => {
      set((state) => {
        const sections = [...state.template.views[viewMode].sections];
        const currentIndex = sections.findIndex((section) => section.id === sectionId);
        
        if (currentIndex === -1) return state;

        const [movedSection] = sections.splice(currentIndex, 1);
        sections.splice(newIndex, 0, movedSection);

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections,
              },
            },
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },

    duplicateSection: (sectionId: string, viewMode: ViewMode) => {
      set((state) => {
        const sectionToDuplicate = state.template.views[viewMode].sections.find(
          (section) => section.id === sectionId
        );
        
        if (!sectionToDuplicate) return state;

        const duplicatedSection: Section = {
          ...sectionToDuplicate,
          id: uuidv4(),
          name: `${sectionToDuplicate.name} (Copy)`,
          rows: sectionToDuplicate.rows.map(row => ({
            ...row,
            id: uuidv4(),
            name: `${row.name} (Copy)`,
            components: row.components.map(component => ({
              ...component,
              id: uuidv4(),
              name: `${component.name} (Copy)`,
            })),
          })),
        };

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections: [...state.template.views[viewMode].sections, duplicatedSection],
              },
            },
            updatedAt: new Date().toISOString(),
          },
          selectedSectionId: duplicatedSection.id,
          selectedRowId: null,
          selectedComponentId: null,
        };
      });
    },

    toggleSectionVisibility: (sectionId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId ? { ...section, visible: !section.visible } : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    toggleSectionLock: (sectionId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId ? { ...section, locked: !section.locked } : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    // Row actions
    addRow: (sectionId: string, viewMode: ViewMode) => {
      const newRow: Row = {
        id: uuidv4(),
        name: `Row ${get().template.views[viewMode].sections.find(s => s.id === sectionId)?.rows.length || 0 + 1}`,
        visible: true,
        locked: false,
        properties: {
          padding: '',
          margin: '0px',
          backgroundColor: 'transparent',
        },
        components: [],
      };

      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? { ...section, rows: [...section.rows, newRow] }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedRowId: newRow.id,
        selectedComponentId: null,
      }));
    },

    removeRow: (sectionId: string, rowId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? { ...section, rows: section.rows.filter((row) => row.id !== rowId) }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedRowId: state.selectedRowId === rowId ? null : state.selectedRowId,
        selectedComponentId: null,
      }));
    },

    updateRow: (sectionId: string, rowId: string, updates: Partial<Row>, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId ? { ...row, ...updates } : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    selectRow: (rowId: string | null) => {
      if (rowId === null) {
        set({ 
          selectedRowId: null,
          selectedComponentId: null,
        });
      } else {
        // Find the row and set the section ID
        const state = get();
        const { template, viewMode } = state;
        
        // Search through all sections to find the row
        for (const section of template.views[viewMode].sections) {
          const row = section.rows.find(r => r.id === rowId);
          if (row) {
            set({ 
              selectedRowId: rowId,
              selectedSectionId: section.id,
              selectedComponentId: null,
            });
            return;
          }
        }
        
        // If row not found, just set the row ID
        set({ 
          selectedRowId: rowId,
          selectedComponentId: null,
        });
      }
    },

    moveRow: (sectionId: string, rowId: string, newIndex: number, viewMode: ViewMode) => {
      set((state) => {
        const section = state.template.views[viewMode].sections.find(s => s.id === sectionId);
        if (!section) return state;

        const rows = [...section.rows];
        const currentIndex = rows.findIndex((row) => row.id === rowId);
        
        if (currentIndex === -1) return state;

        const [movedRow] = rows.splice(currentIndex, 1);
        rows.splice(newIndex, 0, movedRow);

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections: state.template.views[viewMode].sections.map((s) =>
                  s.id === sectionId ? { ...s, rows } : s
                ),
              },
            },
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },

    duplicateRow: (sectionId: string, rowId: string, viewMode: ViewMode) => {
      set((state) => {
        const section = state.template.views[viewMode].sections.find(s => s.id === sectionId);
        if (!section) return state;

        const rowToDuplicate = section.rows.find((row) => row.id === rowId);
        if (!rowToDuplicate) return state;

        const duplicatedRow: Row = {
          ...rowToDuplicate,
          id: uuidv4(),
          name: `${rowToDuplicate.name} (Copy)`,
          components: rowToDuplicate.components.map(component => ({
            ...component,
            id: uuidv4(),
            name: `${component.name} (Copy)`,
          })),
        };

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections: state.template.views[viewMode].sections.map((s) =>
                  s.id === sectionId
                    ? { ...s, rows: [...s.rows, duplicatedRow] }
                    : s
                ),
              },
            },
            updatedAt: new Date().toISOString(),
          },
          selectedRowId: duplicatedRow.id,
          selectedComponentId: null,
        };
      });
    },

    toggleRowVisibility: (sectionId: string, rowId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId ? { ...row, visible: !row.visible } : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    toggleRowLock: (sectionId: string, rowId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId ? { ...row, locked: !row.locked } : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    // Component actions
    addComponentToSection: (sectionId: string, type: ComponentType, viewMode: ViewMode) => {
      const config = COMPONENT_CONFIGS[type];
      if (!config) return;

      const section = get().template.views[viewMode].sections.find(s => s.id === sectionId);
      if (!section) return;

      const newComponent: Component = {
        id: uuidv4(),
        type,
        name: `${config.name} 1`,
        visible: true,
        locked: false,
        properties: { ...config.defaultProperties, columnIndex: 0 },
        position: { ...config.defaultPosition },
      };

      const newRow: Row = {
        id: uuidv4(),
        name: `Row ${section.rows.length + 1}`,
        visible: true,
        locked: false,
        properties: {
          padding: '0px 0',
          margin: '0px',
          backgroundColor: 'transparent',
          columns: 1,
          columnSpacing: '0px',
        },
        components: [newComponent],
      };

      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((s) =>
                s.id === sectionId ? { ...s, rows: [...s.rows, newRow] } : s
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedSectionId: sectionId,
        selectedRowId: newRow.id,
        selectedComponentId: newComponent.id,
      }));
    },

    addComponentToColumn: (sectionId: string, rowId: string, columnIndex: number, type: ComponentType, viewMode: ViewMode) => {
      const config = COMPONENT_CONFIGS[type];
      if (!config) return;

      const newComponent: Component = {
        id: uuidv4(),
        type,
        name: `${config.name} ${get().template.views[viewMode].sections.find(s => s.id === sectionId)?.rows.find(r => r.id === rowId)?.components.length || 0 + 1}`,
        visible: true,
        locked: false,
        properties: { ...config.defaultProperties, columnIndex },
        position: { ...config.defaultPosition },
      };

      get().updateRow(sectionId, rowId, { components: [...(get().template.views[viewMode].sections.find(s => s.id === sectionId)?.rows.find(r => r.id === rowId)?.components || []), newComponent] }, viewMode);
      set({ selectedComponentId: newComponent.id, selectedRowId: rowId, selectedSectionId: sectionId });
    },

    addRowTemplate: (sectionId: string, rowTemplate: unknown, viewMode: ViewMode) => {
      // Create a new row with template properties
      const templateData = rowTemplate as { 
        name: string;
        template: { 
          columns: number; 
          columnSpacing: string; 
          padding: string; 
          margin: string; 
          backgroundColor: string;
          components?: Array<{ type: ComponentType; properties?: Record<string, any> }>;
        } 
      };

      const newComponents: Component[] = (templateData.template.components || []).map((compTmpl, compIndex) => {
        const config = COMPONENT_CONFIGS[compTmpl.type];
        if (!config) return null;

        return {
          id: uuidv4(),
          type: compTmpl.type,
          name: `${config.name} ${compIndex + 1}`,
          visible: true,
          locked: false,
          properties: { ...config.defaultProperties, ...compTmpl.properties, columnIndex: compIndex },
          position: { ...config.defaultPosition },
        };
      }).filter((c): c is Component => c !== null);
      
      const newRow: Row = {
        id: uuidv4(),
        name: templateData.name || `Row ${get().template.views[viewMode].sections.find(s => s.id === sectionId)?.rows.length || 0 + 1}`,
        visible: true,
        locked: false,
        properties: {
          padding: templateData.template?.padding || '',
          margin: templateData.template?.margin || '0px',
          backgroundColor: templateData.template?.backgroundColor || 'transparent',
          columns: templateData.template?.columns || 1,
          columnSpacing: templateData.template?.columnSpacing || '0px',
        },
        components: newComponents,
      };

      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? { ...section, rows: [...section.rows, newRow] }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedRowId: newRow.id,
        selectedComponentId: null,
      }));
    },

    removeComponent: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId
                          ? { ...row, components: row.components.filter((component) => component.id !== componentId) }
                          : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
        selectedComponentId: state.selectedComponentId === componentId ? null : state.selectedComponentId,
      }));
    },

    updateComponent: (sectionId: string, rowId: string, componentId: string, updates: Partial<Component>, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId
                          ? {
                              ...row,
                              components: row.components.map((component) =>
                                component.id === componentId ? { ...component, ...updates } : component
                              ),
                            }
                          : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    selectComponent: (componentId: string | null) => {
      if (componentId === null) {
        set({ 
          selectedComponentId: null,
          selectedSectionId: null,
          selectedRowId: null,
        });
      } else {
        // Find the component and set all related IDs
        const state = get();
        const { template, viewMode } = state;
        
        // Search through all sections and rows to find the component
        for (const section of template.views[viewMode].sections) {
          for (const row of section.rows) {
            const component = row.components.find(c => c.id === componentId);
            if (component) {
              set({ 
                selectedComponentId: componentId,
                selectedSectionId: section.id,
                selectedRowId: row.id,
              });
              return;
            }
          }
        }
        
        // If component not found, just set the component ID
        set({ selectedComponentId: componentId });
      }
    },

    moveComponent: (sectionId: string, rowId: string, componentId: string, newIndex: number, viewMode: ViewMode) => {
      set((state) => {
        const section = state.template.views[viewMode].sections.find(s => s.id === sectionId);
        if (!section) return state;

        const row = section.rows.find(r => r.id === rowId);
        if (!row) return state;

        const components = [...row.components];
        const currentIndex = components.findIndex((component) => component.id === componentId);
        
        if (currentIndex === -1) return state;

        const [movedComponent] = components.splice(currentIndex, 1);
        components.splice(newIndex, 0, movedComponent);

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections: state.template.views[viewMode].sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        rows: s.rows.map((r) =>
                          r.id === rowId ? { ...r, components } : r
                        ),
                      }
                    : s
                ),
              },
            },
            updatedAt: new Date().toISOString(),
          },
        };
      });
    },

    duplicateComponent: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => {
      set((state) => {
        const section = state.template.views[viewMode].sections.find(s => s.id === sectionId);
        if (!section) return state;

        const row = section.rows.find(r => r.id === rowId);
        if (!row) return state;

        const componentToDuplicate = row.components.find((component) => component.id === componentId);
        if (!componentToDuplicate) return state;

        const duplicatedComponent: Component = {
          ...componentToDuplicate,
          id: uuidv4(),
          name: `${componentToDuplicate.name} (Copy)`,
        };

        return {
          template: {
            ...state.template,
            views: {
              ...state.template.views,
              [viewMode]: {
                ...state.template.views[viewMode],
                sections: state.template.views[viewMode].sections.map((s) =>
                  s.id === sectionId
                    ? {
                        ...s,
                        rows: s.rows.map((r) =>
                          r.id === rowId
                            ? { ...r, components: [...r.components, duplicatedComponent] }
                            : r
                        ),
                      }
                    : s
                ),
              },
            },
            updatedAt: new Date().toISOString(),
          },
          selectedComponentId: duplicatedComponent.id,
        };
      });
    },

    toggleComponentVisibility: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId
                          ? {
                              ...row,
                              components: row.components.map((component) =>
                                component.id === componentId ? { ...component, visible: !component.visible } : component
                              ),
                            }
                          : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    toggleComponentLock: (sectionId: string, rowId: string, componentId: string, viewMode: ViewMode) => {
      set((state) => ({
        template: {
          ...state.template,
          views: {
            ...state.template.views,
            [viewMode]: {
              ...state.template.views[viewMode],
              sections: state.template.views[viewMode].sections.map((section) =>
                section.id === sectionId
                  ? {
                      ...section,
                      rows: section.rows.map((row) =>
                        row.id === rowId
                          ? {
                              ...row,
                              components: row.components.map((component) =>
                                component.id === componentId ? { ...component, locked: !component.locked } : component
                              ),
                            }
                          : row
                      ),
                    }
                  : section
              ),
            },
          },
          updatedAt: new Date().toISOString(),
        },
      }));
    },

    // General actions
    setViewMode: (mode: ViewMode) => {
      set({ viewMode: mode });
    },

    setHoveredItem: (id, type) => {
      set({ hoveredItemId: id, hoveredItemType: type });
    },

    undo: () => {
      const historyStore = useHistoryStore.getState();
      historyStore.undo();
      const present = historyStore.present;
      if (present) {
        set({ template: present });
      }
    },

    redo: () => {
      const historyStore = useHistoryStore.getState();
      historyStore.redo();
      const present = historyStore.present;
      if (present) {
        set({ template: present });
      }
    },
  };
}); 