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
    selectedComponentId,
    selectSection,
    hoveredItemId,
    hoveredItemType,
    setHoveredItem,
  } = useTemplateStore();

  const isSelected = selectedSectionId === section.id && !selectedRowId;
  const isHovered = hoveredItemId === section.id && hoveredItemType === 'section';

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
      className={`section-component transition-all relative ${
        isSelected ? 'ring-2 ring-blue-400' : isHovered ? 'ring-2 ring-blue-200' : ''
      } ${section.properties?.display !== 'flex' ? 'space-y-4' : ''}`}
      onClick={handleSelect}
      onMouseEnter={(e) => { e.stopPropagation(); setHoveredItem(section.id, 'section'); }}
      onMouseLeave={(e) => { e.stopPropagation(); setHoveredItem(null, null); }}
      style={{ 
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : (section.properties?.backgroundColor || 'transparent'),
        backgroundImage: section.properties?.backgroundImage ? `url(${section.properties.backgroundImage})` : undefined,
        backgroundSize: section.properties?.backgroundSize || 'cover',
        backgroundPosition: section.properties?.backgroundPosition || 'center',
        backgroundRepeat: section.properties?.backgroundRepeat || 'no-repeat',
        border: isSelected ? '2px solid #60a5fa' : '2px solid transparent',
        padding: section.properties?.padding || '0px',
        margin: section.properties?.margin || '0px',
        maxWidth: section.properties?.maxWidth,
        minHeight: !hasRows ? '80px' : section.properties?.minHeight,
        maxHeight: section.properties?.maxHeight,
        display: section.properties?.display === 'flex' ? 'flex' : 'block',
        flexDirection: section.properties?.display === 'flex' ? (section.properties?.flexDirection || 'column') : undefined,
        justifyContent: section.properties?.display === 'flex' ? section.properties?.justifyContent : undefined,
        alignItems: section.properties?.display === 'flex' ? section.properties?.alignItems : undefined,
        gap: section.properties?.display === 'flex' ? (section.properties?.gap || '0px') : undefined,
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {/* Rows */}
      {hasRows ? (
        section.rows.map((row: Row) => (
          <RowComponent
            key={row.id}
            section={section}
            row={row}
            viewMode={viewMode}
            isSelected={selectedRowId === row.id && !selectedComponentId}
            lastAddedComponentId={lastAddedComponentId}
          />
        ))
      ) : (
        // Empty state: show drop indicator when dragging over
        <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
          {isOver && (
            <div className="flex items-center justify-center w-full h-full border-2 border-dashed border-blue-400 rounded-lg bg-blue-50">
              <div className="text-blue-600 text-sm font-medium">Drop component or row here</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 