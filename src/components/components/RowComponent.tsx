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

interface ColumnProps {
  sectionId: string;
  rowId: string;
  columnIndex: number;
  components: Component[];
  renderComponent: (component: Component) => React.ReactNode;
}
const Column: React.FC<ColumnProps> = ({ sectionId, rowId, columnIndex, components, renderComponent }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-drop-${rowId}-${columnIndex}`,
    data: {
      type: 'column-drop',
      sectionId,
      rowId,
      columnIndex,
    },
  });

  const { hoveredItemId, hoveredItemType, setHoveredItem } = useTemplateStore();
  const columnId = `column-${rowId}-${columnIndex}`;
  const isHovered = hoveredItemId === columnId && hoveredItemType === 'column';

  return (
    <div
      ref={setNodeRef}
      style={{ flex: 1, minHeight: '40px' }}
      className={`space-y-2 rounded-lg transition-all ${
        isOver ? 'bg-blue-100' : ''
      } ${isHovered ? 'ring-1 ring-blue-300' : ''}`}
      onMouseEnter={(e) => { e.stopPropagation(); setHoveredItem(columnId, 'column'); }}
      onMouseLeave={(e) => { e.stopPropagation(); setHoveredItem(null, null); }}
    >
      {components.length > 0 ? (
        components.map(component => renderComponent(component))
      ) : (
        <div className={`h-full w-full text-center flex items-center justify-center text-gray-400 text-xs rounded-lg border-2 border-dashed ${isOver ? 'border-blue-400' : 'border-gray-300'}`}>
          Drop Here
        </div>
      )}
    </div>
  );
};

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
    hoveredItemId,
    hoveredItemType,
    setHoveredItem,
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
  const hasComponents = row.components && row.components.length > 0;
  const { setNodeRef: setDropRef, isOver: isRowOver } = useDroppable({
    id: `row-drop-${row.id}`, // This ID is for dropping on an empty row
    data: {
      type: 'column-drop', // Treat it as dropping into the first column
      rowId: row.id,
      sectionId: section.id,
      columnIndex: 0,
    },
    disabled: hasComponents,
  });

  const handleSelect = () => {
    selectRow(row.id);
  };

  const renderComponent = (component: Component) => {
    switch (component.type) {
      case 'text':
        return (
          <TextComponent
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
            component={component}
            isSelected={selectedComponentId === component.id}
            lastAddedComponentId={lastAddedComponentId}
          />
        );
      case 'button':
        return (
          <ButtonComponent
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

  const isHovered = hoveredItemId === row.id && hoveredItemType === 'row';

  const numColumns = row.properties.columns || 1;
  const columns = Array.from({ length: numColumns }, (_, i) => 
      row.components.filter(c => (c.properties.columnIndex || 0) === i)
  );

  return (
    <div
      ref={(node) => {
        setRowRef(node);
        setDropRef(node);
      }}
      {...attributes}
      {...listeners}
      className={`row-component transition-all ${
        isSelected ? 'ring-2 ring-green-400' : isHovered ? 'ring-2 ring-green-200' : ''
      } ${row.locked ? 'opacity-75' : ''} ${isRowDragging ? 'opacity-50 scale-95' : ''} ${
        isRowOver ? 'ring-2 ring-green-400 bg-green-50' : ''
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleSelect();
        }
      }}
      onMouseEnter={(e) => { e.stopPropagation(); setHoveredItem(row.id, 'row'); }}
      onMouseLeave={(e) => { e.stopPropagation(); setHoveredItem(null, null); }}
      style={{
        padding: row.properties.padding || '0px',
        margin: row.properties.margin || '0px',
        backgroundColor: isRowOver ? 'rgba(34, 197, 94, 0.05)' : (row.properties.backgroundColor || 'transparent'),
        border: 'none',
        boxShadow: 'none',
        cursor: 'pointer',
        minHeight: hasComponents ? 'auto' : '40px',
        pointerEvents: 'auto',
        display: 'block',
        borderRadius: '8px',
      }}
    >
      {/* Components */}
      {hasComponents ? (
        // Use flex layout with columns for both single and multi-column rows
        <div
          className="w-full"
          style={{
          display: 'flex',
          flexDirection: row.properties.flexDirection || 'row',
          gap: row.properties.gap || row.properties.columnSpacing || '0px',
          alignItems: row.properties.alignItems || 'flex-start',
          justifyContent: row.properties.justifyContent || 'flex-start',
        }}
        >
          {columns.map((componentsInColumn, index) => (
            <Column
              key={index}
              sectionId={section.id}
              rowId={row.id}
              columnIndex={index}
              components={componentsInColumn}
              renderComponent={renderComponent}
            />
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-sm p-4">Empty {numColumns}-column row</div>
      )}
    </div>
  );
}; 