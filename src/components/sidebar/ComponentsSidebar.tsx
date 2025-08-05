import React, { useState } from 'react';
import { Type, Image, Square, Grid, Columns, Rows, Box } from 'lucide-react';
import { COMPONENT_CONFIGS, COMPONENT_TYPES } from '../../constants/componentTypes';
import { useDraggable } from '@dnd-kit/core';
 
// Row templates that users can drag into sections
const ROW_TEMPLATES = [
  {
    id: 'single-column',
    name: 'Single Column',
    description: 'One column layout',
    icon: Columns,
    template: {
      columns: 1,
      columnSpacing: '0px',
      padding: '0px 0',
      margin: '0px',
      backgroundColor: 'transparent',
      components: [
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'This is a single column. Drag components here.' } }
      ]
    }
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Two column layout',
    icon: Grid,
    template: {
      columns: 2,
      columnSpacing: '20px',
      padding: '0px 0',
      margin: '0px',
      backgroundColor: 'transparent',
      components: [
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'Column 1' } },
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'Column 2' } }
      ]
    }
  },
  {
    id: 'three-column',
    name: 'Three Column',
    description: 'Three column layout',
    icon: Rows,
    template: {
      columns: 3,
      columnSpacing: '15px',
      padding: '0px 0',
      margin: '0px',
      backgroundColor: 'transparent',
      components: [
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'Column 1' } },
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'Column 2' } },
        { type: COMPONENT_TYPES.TEXT, properties: { content: 'Column 3' } }
      ]
    }
  }
];

const componentIcons = {
  [COMPONENT_TYPES.TEXT]: Type,
  [COMPONENT_TYPES.IMAGE]: Image,
  [COMPONENT_TYPES.BUTTON]: Square,
};

type TabType = 'content' | 'layout';

// Draggable Component Item
const DraggableComponent: React.FC<{ type: string; config: { name: string } }> = ({ type, config }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      type: 'component',
      componentType: type,
    },
  });

  const Icon = componentIcons[type as keyof typeof componentIcons];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02] hover:shadow-md'
      }`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'rotate(2deg)' : undefined,
      }}
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{config.name}</div>
        <div className="text-sm text-gray-500">Drag to section</div>
      </div>
    </div>
  );
};

// Draggable Section Template
const DraggableSectionTemplate: React.FC = () => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: 'section-template',
    data: {
      type: 'section-template',
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02] hover:shadow-md'
      }`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'rotate(2deg)' : undefined,
      }}
    >
      <div className="flex-shrink-0">
        <Box className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <div className="font-medium text-gray-900">Section</div>
        <div className="text-sm text-gray-500">Add a new content section</div>
      </div>
    </div>
  );
};

// Draggable Row Template Item
const DraggableRowTemplate: React.FC<{ rowTemplate: { id: string; name: string; description: string; icon: React.ComponentType<{ className?: string }> } }> = ({ rowTemplate }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `row-${rowTemplate.id}`,
    data: {
      type: 'row',
      rowTemplate: rowTemplate,
    },
  });

  const Icon = rowTemplate.icon;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`w-full flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02] hover:shadow-md'
      }`}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: isDragging ? 'rotate(2deg)' : undefined,
      }}
    >
      <div className="flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <div className="font-medium text-gray-900">{rowTemplate.name}</div>
        <div className="text-sm text-gray-500">{rowTemplate.description}</div>
      </div>
    </div>
  );
};

export const ComponentsSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  return (
    <div className="w-64 bg-white border-r border-gray-200 components-sidebar">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'content'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'layout'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('layout')}
        >
          Layout
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'content' ? (
          <div>
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Content Blocks</h4>
              <p className="text-sm text-gray-600">Drag content into columns.</p>
            </div>

            <div className="space-y-2">
              {Object.entries(COMPONENT_CONFIGS).map(([type, config]) => (
                <DraggableComponent key={type} type={type} config={config} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Layout Blocks</h4>
              <p className="text-sm text-gray-600">Drag sections or rows onto the canvas.</p>
            </div>

            <div className="space-y-2">
              <DraggableSectionTemplate />
              {ROW_TEMPLATES.map((rowTemplate) => (
                <DraggableRowTemplate key={rowTemplate.id} rowTemplate={rowTemplate} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">How to use</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1. Drag a Section or Row to the canvas.</li>
            <li>2. Drag Content blocks into columns.</li>
            <li>3. Select an item to edit its properties.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 