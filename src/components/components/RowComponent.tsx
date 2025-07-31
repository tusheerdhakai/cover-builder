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
        isOver ? 'ring-2 ring-green-400 bg-green-50' : ''
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSelect();
        }
      }}
      style={{
        padding: row.properties.padding || '0px',
        margin: row.properties.margin || '0px',
        backgroundColor: isOver ? 'rgba(34, 197, 94, 0.05)' : (row.properties.backgroundColor || 'transparent'),
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        pointerEvents: 'auto',
        minHeight: !hasComponents ? '40px' : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
      }}
    >
      {/* Components */}
      {hasComponents ? (
        <div className="space-y-2 w-full">
          {row.components.map((component) => renderComponent(component))}
        </div>
      ) : null}
    </div>
  );
}; 