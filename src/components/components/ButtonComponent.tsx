import React from 'react';
import type { Component } from '../../types/template';
import { useTemplateStore } from '../../stores/templateStore';

interface ButtonComponentProps {
  component: Component;
  isSelected: boolean;
  sectionId?: string;
  rowId?: string;
  viewMode?: string;
  lastAddedComponentId?: string | null;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({
  component,
  isSelected,
  lastAddedComponentId,
}) => {
  const { selectComponent, hoveredItemId, hoveredItemType, setHoveredItem } = useTemplateStore();
  const { properties } = component;
  
  const isNewlyAdded = lastAddedComponentId === component.id;
  const isHovered = hoveredItemId === component.id && hoveredItemType === 'component';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={(e) => { e.stopPropagation(); setHoveredItem(component.id, 'component'); }}
      onMouseLeave={(e) => { e.stopPropagation(); setHoveredItem(null, null); }}
      className={`transition-all duration-500 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : isHovered ? 'ring-1 ring-blue-300' : ''
      } ${
        isNewlyAdded ? 'animate-pulse ring-2 ring-green-500 ring-offset-2 bg-green-50' : ''
      }`}
      style={{
        padding: properties.padding || '0px',
        margin: properties.margin || '0px',
        backgroundColor: isNewlyAdded ? 'rgba(34, 197, 94, 0.1)' : (properties.backgroundColor || 'transparent'),
        border: properties.border || 'none',
        borderRadius: properties.borderRadius || '0px',
        cursor: 'pointer',
      }}
    >
      <button
        className="inline-block"
        style={{
          backgroundColor: properties.buttonBackgroundColor || '#007bff',
          color: properties.buttonTextColor || '#ffffff',
          padding: properties.buttonPadding || '12px 24px',
          borderRadius: properties.borderRadius || '4px',
          border: 'none',
          cursor: 'pointer',
          fontSize: properties.fontSize || '16px',
          fontWeight: properties.fontWeight || 'normal',
          fontFamily: properties.fontFamily || 'Arial, sans-serif',
        }}
      >
        {properties.buttonText || 'Button'}
      </button>
    </div>
  );
}; 