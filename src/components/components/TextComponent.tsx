import React from 'react';
import type { Component } from '../../types/template';
import { useTemplateStore } from '../../stores/templateStore';

interface TextComponentProps {
  component: Component;
  sectionId: string;
  rowId: string;
  viewMode: string;
  isSelected: boolean;
  lastAddedComponentId?: string | null;
}

export const TextComponent: React.FC<TextComponentProps> = ({
  component,
  isSelected,
  lastAddedComponentId,
}) => {
  const { selectComponent } = useTemplateStore();
  const { properties } = component;
  
  const isNewlyAdded = lastAddedComponentId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  return (
    <div
      onClick={handleClick}
      className={`transition-all duration-500 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''
      } ${
        isNewlyAdded ? 'animate-pulse ring-2 ring-green-500 ring-offset-2 bg-green-50' : ''
      }`}
      style={{
        padding: properties.padding,
        margin: properties.margin || '0px',
        backgroundColor: isNewlyAdded ? 'rgba(34, 197, 94, 0.1)' : (properties.backgroundColor || 'transparent'),
        border: properties.border || 'none',
        borderRadius: properties.borderRadius || '0px',
        fontSize: properties.fontSize || '16px',
        fontWeight: properties.fontWeight || 'normal',
        color: properties.color || '#333333',
        textAlign: properties.textAlign || 'left',
        lineHeight: properties.lineHeight || '1.5',
        fontFamily: properties.fontFamily || 'Arial, sans-serif',
        textDecoration: properties.textDecoration || 'none',
        cursor: 'pointer',
      }}
    >
      <div
        dangerouslySetInnerHTML={{ 
          __html: properties.content || 'Text content' 
        }}
      />
    </div>
  );
}; 