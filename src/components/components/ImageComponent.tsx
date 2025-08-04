import React from 'react';
import type { Component } from '../../types/template';
import { useTemplateStore } from '../../stores/templateStore';

interface ImageComponentProps {
  component: Component;
  isSelected: boolean;
  lastAddedComponentId?: string | null;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({
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
        isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : isHovered ? 'ring-1 ring-blue-300' : ''
      } ${
        isNewlyAdded ? 'animate-pulse ring-2 ring-green-500 ring-offset-2 bg-green-50' : ''
      }`}
      style={{
        padding: properties.padding,
        margin: properties.margin || '0px',
        backgroundColor: isNewlyAdded ? 'rgba(34, 197, 94, 0.1)' : (properties.backgroundColor || 'transparent'),
        border: properties.border || 'none',
        borderRadius: properties.borderRadius || '0px',
        cursor: 'pointer',
      }}
    >
      {properties.src ? (
        <img
          src={properties.src}
          alt={properties.alt || 'Image'}
          style={{
            width: properties.imageWidth || '100%',
            height: properties.imageHeight || 'auto',
            maxWidth: '100%',
          }}
        />
      ) : (
        <div
          className="w-full h-32 bg-gray-200 text-gray-500"
          style={{
            display: 'block',
            textAlign: 'center',
            lineHeight: '8rem', // 32 * 0.25rem = 8rem
            height: '8rem',
          }}
        >
          No image selected
        </div>
      )}
    </div>
  );
}; 