import React from 'react';
import type { Section, Row, Component, ViewMode } from '../../types/template';
import { TextComponent } from './TextComponent';
import { ImageComponent } from './ImageComponent';
import { ButtonComponent } from './ButtonComponent';
import { useTemplateStore } from '../../stores/templateStore';
import { useDraggable, useDroppable } from '@dnd-kit/core';

interface RowComponentProps {
  section: Section;
  row: Row;
  viewMode: ViewMode;
  isSelected: boolean;
  lastAddedComponentId?: string | null;
}

export const RowComponent: React.FC<RowComponentProps> = ({
  section,
  row,
  viewMode,
  isSelected,
  lastAddedComponentId,
}) => {
  const {
    selectedComponentId,
    selectRow,
  } = useTemplateStore();

  // Make the row draggable
  const { attributes, listeners, setNodeRef: setRowRef, isDragging: isRowDragging } = useDraggable({
    id: `row-${row.id}`,
    data: {
      type: 'row',
      rowId: row.id,
      sectionId: section.id,
    },
  });

  // Make the row a drop target for components
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `row-drop-${row.id}`,
    data: {
      type: 'row-drop',
      rowId: row.id,
      sectionId: section.id,
    },
  });

  // Debug logging
  React.useEffect(() => {
    if (isOver) {
      console.log('Row is being targeted for drop:', { rowId: row.id, sectionId: section.id });
    }
  }, [isOver, row.id, section.id]);

  const handleSelect = () => {
    selectRow(row.id);
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case 'text':
        return (
          <TextComponent
            key={component.id}
            component={component}
            sectionId={section.id}
            rowId={row.id}
            viewMode={viewMode}
            isSelected={selectedComponentId === component.id}
            lastAddedComponentId={lastAddedComponentId}
          />
        );
      case 'image':
        return (
          <ImageComponent
            key={component.id}
            component={component}
            isSelected={selectedComponentId === component.id}
            lastAddedComponentId={lastAddedComponentId}
          />
        );
      case 'button':
        return (
          <ButtonComponent
            key={component.id}
            component={component}
            sectionId={section.id}
            rowId={row.id}
            viewMode={viewMode}
            isSelected={selectedComponentId === component.id}
            lastAddedComponentId={lastAddedComponentId}
          />
        );
      default:
        return null;
    }
  };

  if (!row.visible) {
    return null;
  }

  const hasComponents = row.components && row.components.length > 0;

  return (
    <div
      ref={(node) => {
        setRowRef(node);
        setDropRef(node);
      }}
      {...attributes}
      {...listeners}
      className={`row-component transition-all ${
        isSelected ? 'ring-2 ring-green-400' : ''
      } ${row.locked ? 'opacity-75' : ''} ${isRowDragging ? 'opacity-50 scale-95' : ''} ${
        isOver ? 'ring-2 ring-green-400 bg-green-50 row-drop-active' : ''
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSelect();
        }
      }}
      style={{
        padding: row.properties.padding || '0px',
        margin: row.properties.margin || '0px',
        backgroundColor: isOver ? 'rgba(34, 197, 94, 0.15)' : (row.properties.backgroundColor || 'transparent'),
        border: isOver ? '3px dashed #10b981' : '2px solid transparent',
        boxShadow: isOver ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
        cursor: 'pointer',
        pointerEvents: 'auto',
        minHeight: !hasComponents ? '80px' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
      }}
    >
      {/* Components */}
      {hasComponents ? (
        <div 
          className="w-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${row.properties.columns || 1}, 1fr)`,
            gap: row.properties.columnSpacing || '0px',
          }}
        >
          {row.components.map((component) => renderComponent(component))}
        </div>
      ) : (
        /* Drop zone indicator when row is empty */
        <div className="w-full h-full flex items-center justify-center">
          {isOver ? (
            <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-green-400 rounded-lg bg-green-50">
              <div className="text-green-600 text-sm font-medium">Drop component here</div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-gray-500 text-sm">Empty row - drag components here</div>
            </div>
          )}
        </div>
      )}

      {/* Visual indicator when dragging over */}
      {isOver && (
        <div className="component-drag-indicator">
          Drop Component Here
        </div>
      )}
    </div>
  );
}; 