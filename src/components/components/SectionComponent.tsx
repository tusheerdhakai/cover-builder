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
      } ${isOver ? 'ring-2 ring-green-400 bg-green-50' : ''}`}
      onClick={handleSelect}
      style={{ 
        background: isOver ? 'rgba(34, 197, 94, 0.05)' : 'none', 
        border: 'none', 
        boxShadow: 'none', 
        minHeight: !hasRows ? '60px' : undefined, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '8px',
        padding: isOver ? '8px' : '0px',
      }}
    >
      {/* Drop zone indicator when section is empty */}
      {!hasRows && isOver && (
        <div className="flex items-center justify-center w-full h-12 border-2 border-dashed border-green-400 rounded-lg bg-green-50">
          <div className="text-green-600 text-sm font-medium">Drop component here</div>
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
    </div>
  );
}; 