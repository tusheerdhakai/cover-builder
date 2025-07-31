import React from 'react';
import type { Section, Row, ViewMode } from '../../types/template';
import { RowComponent } from './RowComponent';
import { useTemplateStore } from '../../stores/templateStore';
import { useDroppable } from '@dnd-kit/core';

interface SectionComponentProps {
  section: Section;
  viewMode: ViewMode;
  lastAddedComponentId?: string | null;
}

export const SectionComponent: React.FC<SectionComponentProps> = ({
  section,
  viewMode,
  lastAddedComponentId,
}) => {
  const {
    selectedSectionId,
    selectedRowId,
    selectSection,
  } = useTemplateStore();

  const isSelected = selectedSectionId === section.id;

  // Make this section a drop target
  const { setNodeRef, isOver } = useDroppable({
    id: `section-${section.id}`,
    data: {
      type: 'section',
      sectionId: section.id,
    },
  });

  const handleSelect = () => {
    selectSection(section.id);
  };

  if (!section.visible) {
    return null;
  }

  const hasRows = section.rows && section.rows.length > 0;

  return (
    <div
      ref={setNodeRef}
      className={`section-component mb-4 transition-all ${
        isSelected ? 'ring-2 ring-blue-400' : ''
      } ${isOver ? 'ring-2 ring-blue-400 bg-blue-50 section-drop-active' : ''}`}
      onClick={handleSelect}
      style={{ 
        background: isOver ? 'rgba(34, 197, 94, 0.1)' : (section.properties?.backgroundColor || 'transparent'), 
        border: isOver ? '3px dashed #3b82f6' : '2px solid transparent',
        boxShadow: isOver ? '0 8px 25px rgba(59, 130, 246, 0.3)' : 'none',
        minHeight: !hasRows ? '80px' : undefined, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '12px',
        padding: isOver ? '12px' : (section.properties?.padding || '0px'),
        margin: section.properties?.margin || '0px',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
      }}
    >
      {/* Drop zone indicator when section is empty */}
      {!hasRows && isOver && (
        <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
          <div className="text-blue-600 text-sm font-medium">Drop component or row here</div>
        </div>
      )}
      
      {/* Rows */}
      {hasRows ? (
        <div className="space-y-4 w-full">
          {section.rows.map((row: Row) => (
            <RowComponent
              key={row.id}
              section={section}
              row={row}
              viewMode={viewMode}
              isSelected={selectedRowId === row.id}
              lastAddedComponentId={lastAddedComponentId}
            />
          ))}
        </div>
      ) : null}

      {/* Visual indicator when dragging over section */}
      {isOver && (
        <div className="section-drop-indicator">
          Drop Here
        </div>
      )}
    </div>
  );
}; 