import React from 'react';
import type { Layer } from '../../types/template';
import { TextComponent } from '../components/TextComponent';
import { ImageComponent } from '../components/ImageComponent';
import { ButtonComponent } from '../components/ButtonComponent';
import { RowComponent } from '../components/RowComponent';

interface CanvasLayerProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
}

export const CanvasLayer: React.FC<CanvasLayerProps> = ({
  layer,
  isSelected,
  onSelect,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const renderComponent = () => {
    switch (layer.type) {
      case 'text':
        return <TextComponent layer={layer} />;
      case 'image':
        return <ImageComponent layer={layer} />;
      case 'button':
        return <ButtonComponent layer={layer} />;
      case 'row':
        return <RowComponent layer={layer} />;
      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-2'
          : 'hover:ring-1 hover:ring-gray-300'
      }`}
      style={{
        left: layer.position.x,
        top: layer.position.y,
        width: layer.position.width,
        height: layer.position.height,
        zIndex: layer.zIndex,
      }}
      onClick={handleClick}
    >
      {renderComponent()}
    </div>
  );
}; 