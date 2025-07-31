import React, { useState } from 'react';
import { Type, Image, Square, Layers, Grid, Columns, Rows } from 'lucide-react';
import { COMPONENT_CONFIGS, COMPONENT_TYPES } from '../../constants/componentTypes';
import { useTemplateStore } from '../../stores/templateStore';
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
      padding: '20px',
      margin: '0px',
      backgroundColor: 'transparent',
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
      padding: '20px',
      margin: '0px',
      backgroundColor: 'transparent',
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
      padding: '20px',
      margin: '0px',
      backgroundColor: 'transparent',
    }
  },
  {
    id: 'header-row',
    name: 'Header Row',
    description: 'Header with navigation',
    icon: Layers,
    template: {
      columns: 1,
      columnSpacing: '0px',
      padding: '15px 20px',
      margin: '0px',
      backgroundColor: '#f8f9fa',
    }
  },
  {
    id: 'footer-row',
    name: 'Footer Row',
    description: 'Footer with links',
    icon: Layers,
    template: {
      columns: 1,
      columnSpacing: '0px',
      padding: '20px',
      margin: '0px',
      backgroundColor: '#343a40',
    }
  }
];

const componentIcons = {
  [COMPONENT_TYPES.TEXT]: Type,
  [COMPONENT_TYPES.IMAGE]: Image,
  [COMPONENT_TYPES.BUTTON]: Square,
};

type TabType = 'components' | 'rows';

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

// Draggable Row Template Item
const DraggableRowTemplate: React.FC<{ rowTemplate: { id: string; name: string; description: string; icon: React.ComponentType<{ className?: string }>; template: any } }> = ({ rowTemplate }) => {
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
  const [activeTab, setActiveTab] = useState<TabType>('components');
  const { addSection, viewMode } = useTemplateStore();

  const handleAddSection = () => {
    addSection(viewMode);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 components-sidebar">
      {/* Add Section Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          className="w-full flex items-center gap-3 p-3 text-left border-2 border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-colors"
          onClick={handleAddSection}
        >
          <div className="flex-shrink-0">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-blue-900">Add Section</div>
            <div className="text-sm text-blue-700">Create a new section for your email</div>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('components')}
        >
          Components
        </button>
        <button
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'rows'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('rows')}
        >
          Rows
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'components' ? (
          <div>
            <div className="mb-4">
              <h4 className="text-md font-semibold text-gray-900 mb-2">Components</h4>
              <p className="text-sm text-gray-600">Drag components into sections</p>
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
              <h4 className="text-md font-semibold text-gray-900 mb-2">Row Templates</h4>
              <p className="text-sm text-gray-600">Drag row templates into sections</p>
            </div>

            <div className="space-y-2">
              {ROW_TEMPLATES.map((rowTemplate) => (
                <DraggableRowTemplate key={rowTemplate.id} rowTemplate={rowTemplate} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">How to use</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1. Add a section to your email</li>
            <li>2. Drag rows or components into sections</li>
            <li>3. Customize your content</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 