import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import type { Layer } from '../../types/template';

interface SortableLayerItemProps {
  layer: Layer;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  layer,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group flex items-center gap-2 p-2 rounded border cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 border-blue-200'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } ${isDragging ? 'shadow-lg' : ''}`}
      onClick={onSelect}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 w-4 h-4 bg-gray-300 rounded cursor-grab active:cursor-grabbing" />

      {/* Visibility Toggle */}
      <button
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
      >
        {layer.visible ? (
          <Eye className="w-4 h-4 text-gray-600" />
        ) : (
          <EyeOff className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Lock Toggle */}
      <button
        className="flex-shrink-0 p-1 hover:bg-gray-200 rounded"
        onClick={(e) => {
          e.stopPropagation();
          onToggleLock();
        }}
      >
        {layer.locked ? (
          <Lock className="w-4 h-4 text-gray-600" />
        ) : (
          <Unlock className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Layer Info */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {layer.name}
        </div>
        <div className="text-xs text-gray-500 capitalize">
          {layer.type}
        </div>
      </div>

      {/* Layer Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          {/* Move Up */}
          <button
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
            disabled={isFirst}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
          >
            <ChevronUp className="w-3 h-3 text-gray-600" />
          </button>

          {/* Move Down */}
          <button
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
            disabled={isLast}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
          >
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </button>

          {/* Duplicate */}
          <button
            className="p-1 hover:bg-gray-200 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
          >
            <Copy className="w-3 h-3 text-gray-600" />
          </button>

          {/* Delete */}
          <button
            className="p-1 hover:bg-red-100 rounded"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}; 