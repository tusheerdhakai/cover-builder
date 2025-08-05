import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTemplateStore } from '../../stores/templateStore';
import { SortableSectionItem } from './SortableSectionItem';
import { ChevronDown, ChevronRight, Layers, Grid, Box } from 'lucide-react';

export const SectionsPanel: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const {
    template,
    viewMode,
    selectedSectionId,
    selectedRowId,
    selectedComponentId,
    selectSection,
    selectRow,
    selectComponent,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
    toggleSectionLock,
    moveSection,
  } = useTemplateStore();

  const currentSections = template.views[viewMode].sections;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentSections.findIndex((section) => section.id === active.id);
      const newIndex = currentSections.findIndex((section) => section.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveSection(active.id as string, newIndex, viewMode);
      }

    }
  };

  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleRowExpanded = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sections</h3>
        <p className="text-sm text-gray-600">
          {viewMode === 'desktop' ? 'Desktop' : 'Mobile'} view
        </p>
      </div>

      <div className="space-y-1">
        {currentSections.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm">No sections yet</p>
            <p className="text-xs">Add sections to see them here</p>
          </div>
        ) : (
          currentSections.map((section, index) => (
            <div key={section.id} className="space-y-1">
              {/* Section Item */}
              <div
                className={`group flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                  selectedSectionId === section.id && !selectedRowId && !selectedComponentId
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => selectSection(section.id)}
              >
                {/* Expand/Collapse Button */}
                <button
                  className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionExpanded(section.id);
                  }}
                >
                  {section.rows.length > 0 ? (
                    expandedSections.has(section.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    )
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>

                {/* Section Icon */}
                <Layers className="w-4 h-4 text-blue-500 flex-shrink-0" />

                {/* Section Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {section.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {section.rows.length} row{section.rows.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Rows (when section is expanded) */}
              {expandedSections.has(section.id) && section.rows.map((row, rowIndex) => {
                const isSingleColumn = (row.properties.columns || 1) === 1;
                const shouldSkipRowLayer = isSingleColumn && row.components.length > 0;

                return (
                  <div key={row.id} className="ml-6 space-y-1">
                    {/* For single column rows with components, show components directly */}
                    {shouldSkipRowLayer ? (
                      row.components.map((component, componentIndex) => (
                        <div
                          key={component.id}
                          className={`group flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                            selectedComponentId === component.id
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectComponent(component.id);
                          }}
                        >
                          <div className="w-4 h-4" />
                          
                          {/* Component Icon */}
                          <Box className="w-4 h-4 text-orange-500 flex-shrink-0" />

                          {/* Component Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {component.name}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {component.type}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Row Item (for multi-column or empty rows) */}
                        <div
                          className={`group flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                            selectedRowId === row.id && !selectedComponentId
                              ? 'bg-green-50 border-green-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectRow(row.id);
                          }}
                        >
                          {/* Expand/Collapse Button */}
                          <button
                            className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpanded(row.id);
                            }}
                          >
                            {row.components.length > 0 ? (
                              expandedRows.has(row.id) ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </button>

                          {/* Row Icon */}
                          <Grid className="w-4 h-4 text-green-500 flex-shrink-0" />

                          {/* Row Info */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {row.name} {!isSingleColumn && `(${row.properties.columns || 1} cols)`}
                            </div>
                            <div className="text-xs text-gray-500">
                              {row.components.length} component{row.components.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>

                        {/* Components (when row is expanded) */}
                        {expandedRows.has(row.id) && row.components.map((component, componentIndex) => (
                          <div
                            key={component.id}
                            className={`ml-6 group flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
                              selectedComponentId === component.id
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectComponent(component.id);
                            }}
                          >
                            <div className="w-4 h-4" />
                            
                            {/* Component Icon */}
                            <Box className="w-4 h-4 text-orange-500 flex-shrink-0" />

                            {/* Component Info */}
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {component.name}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {component.type}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {currentSections.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>• Click to select item</p>
            <p>• Single-column rows show components directly</p>
            <p>• Multi-column rows show expandable structure</p>
            <p>• Selection syncs with canvas</p>
          </div>
        </div>
      )}
    </div>
  );
}; 
