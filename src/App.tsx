import { useState, useEffect } from 'react';
import { Header } from './components/ui/Header';
import { ComponentsSidebar } from './components/sidebar/ComponentsSidebar';
import { Canvas } from './components/canvas/Canvas';
import { PropertiesPanel } from './components/properties/PropertiesPanel';
import { SectionsPanel } from './components/layers/LayersPanel';
import { TemplateLibrary } from './components/library/TemplateLibrary';
import { NotificationManager } from './components/ui/NotificationManager';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { useNotifications } from './hooks/useNotifications';
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useTemplateStore } from './stores/templateStore';
import { COMPONENT_CONFIGS } from './constants/componentTypes';
import { Type, Image, Square, Layers, Grid, Columns, Rows } from 'lucide-react';

import { storageUtils } from './utils/storageUtils';
import './App.css';

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
  text: Type,
  image: Image,
  button: Square,
};

function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [lastAddedComponentId, setLastAddedComponentId] = useState<string | null>(null);
  const { notifications, removeNotification, addNotification } = useNotifications();
  const { addComponentToSection, addRowTemplate, viewMode } = useTemplateStore();
  
  useKeyboardShortcuts();
  useAutoSave();

  // Function to highlight component list after successful drop
  const highlightComponentList = () => {
    // Find the component sidebar element
    const sidebar = document.querySelector('.components-sidebar');
    if (sidebar) {
      // Add a temporary highlight class
      sidebar.classList.add('highlight-drop-success');
      
      // Remove the highlight after animation completes
      setTimeout(() => {
        sidebar.classList.remove('highlight-drop-success');
      }, 1000);
    }
  };

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Load saved template on mount
  useEffect(() => {
    const savedTemplate = storageUtils.getCurrentTemplate();
    if (savedTemplate) {
      // Update the template store with the saved template
      // This would need to be implemented in the template store
      console.log('Loaded saved template:', savedTemplate.name);
    }
  }, []);

  const handleLoadTemplate = (loadedTemplate: unknown) => {
    // This would need to be implemented in the template store
    console.log('Loading template:', loadedTemplate);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setIsDropping(false);
    // Don't clear selection on drag start for components from sidebar
    // This allows the newly created component to remain selected
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setIsDropping(false);
      return;
    }

    const draggedItem = active.data.current;
    const targetData = over.data.current;

    // Show dropping animation
    setIsDropping(true);

    // Handle dragging components from sidebar to sections
    if (draggedItem?.type === 'component' && targetData?.type === 'section') {
      const sectionId = targetData.sectionId;
      const componentType = draggedItem.componentType;
      
      // Add a longer delay to show the dropping animation and make it feel more natural
      setTimeout(() => {
        addComponentToSection(sectionId, componentType, viewMode);
        // Get the newly added component ID from the store
        const state = useTemplateStore.getState();
        const newComponentId = state.selectedComponentId;
        if (newComponentId) {
          setLastAddedComponentId(newComponentId);
          // Clear the highlight after 2 seconds
          setTimeout(() => {
            setLastAddedComponentId(null);
          }, 2000);
          
          // Show success notification
          const config = COMPONENT_CONFIGS[componentType];
          addNotification('success', 'Component Added', `${config.name} has been added to the section`, 3000);
        }
        // Keep the overlay visible for a bit longer to show successful drop
        setTimeout(() => {
          setActiveId(null);
          setIsDropping(false);
          // Move cursor back to component list
          highlightComponentList();
        }, 200);
      }, 200);
      return;
    }
    // Handle dragging row templates from sidebar to sections
    else if (draggedItem?.type === 'row' && targetData?.type === 'section' && !draggedItem.rowId) {
      const sectionId = targetData.sectionId;
      const rowTemplate = draggedItem.rowTemplate;
      
      setTimeout(() => {
        addRowTemplate(sectionId, rowTemplate, viewMode);
        // Keep the overlay visible for a bit longer to show successful drop
        setTimeout(() => {
          setActiveId(null);
          setIsDropping(false);
          // Move cursor back to component list
          highlightComponentList();
        }, 200);
        
        // Show success notification
        addNotification('success', 'Row Added', `${rowTemplate.name} has been added to the section`, 3000);
      }, 200);
      return;
    }
    // Handle dragging components between rows
    else if (draggedItem?.type === 'component' && targetData?.type === 'row-drop') {
      const { componentType } = draggedItem;
      const { sectionId: targetSectionId } = targetData;
      
      setTimeout(() => {
        addComponentToSection(targetSectionId, componentType, viewMode);
        // Keep the overlay visible for a bit longer to show successful drop
        setTimeout(() => {
          setActiveId(null);
          setIsDropping(false);
          // Move cursor back to component list
          highlightComponentList();
        }, 200);
      }, 200);
      return;
    }
    // Handle dragging existing rows between sections
    else if (draggedItem?.type === 'row' && targetData?.type === 'section' && draggedItem.rowId) {
      const { sectionId: targetSectionId } = targetData;
      
      setTimeout(() => {
        addRowTemplate(targetSectionId, { template: { columns: 1, columnSpacing: '0px', padding: '20px', margin: '0px', backgroundColor: 'transparent' } }, viewMode);
        // Keep the overlay visible for a bit longer to show successful drop
        setTimeout(() => {
          setActiveId(null);
          setIsDropping(false);
          // Move cursor back to component list
          highlightComponentList();
        }, 200);
      }, 200);
      return;
    }

    // If no valid drop target, reset immediately
    setActiveId(null);
    setIsDropping(false);
  };

  // Render drag overlay
  const renderDragOverlay = () => {
    if (!activeId) return null;

    // Handle component drag overlay
    if (activeId.startsWith('component-')) {
      const componentType = activeId.replace('component-', '');
      const config = COMPONENT_CONFIGS[componentType];
      const Icon = componentIcons[componentType as keyof typeof componentIcons];
      
      return (
        <div className={`w-64 flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg bg-white shadow-lg transition-all duration-300 ${
          isDropping ? 'opacity-80 scale-95 rotate-6 bg-green-50 border-green-300 drop-bounce' : 'opacity-90'
        }`}>
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${isDropping ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <div className={`font-medium ${isDropping ? 'text-green-900' : 'text-gray-900'}`}>{config.name}</div>
            <div className={`text-sm ${isDropping ? 'text-green-700' : 'text-gray-500'}`}>
              {isDropping ? '✓ Added to section' : 'Drag to section'}
            </div>
          </div>
        </div>
      );
    }

    // Handle row template drag overlay
    if (activeId.startsWith('row-')) {
      const rowId = activeId.replace('row-', '');
      const rowTemplate = ROW_TEMPLATES.find(template => template.id === rowId);
      
      if (rowTemplate) {
        const Icon = rowTemplate.icon;
        
        return (
          <div className={`w-64 flex items-center gap-3 p-3 text-left border border-gray-200 rounded-lg bg-white shadow-lg transition-all duration-300 ${
            isDropping ? 'opacity-80 scale-95 rotate-6 bg-green-50 border-green-300 drop-bounce' : 'opacity-90'
          }`}>
            <div className="flex-shrink-0">
              <Icon className={`w-5 h-5 ${isDropping ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <div className={`font-medium ${isDropping ? 'text-green-900' : 'text-gray-900'}`}>{rowTemplate.name}</div>
              <div className={`text-sm ${isDropping ? 'text-green-700' : 'text-gray-500'}`}>
                {isDropping ? '✓ Added to section' : rowTemplate.description}
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header onOpenLibrary={() => setIsLibraryOpen(true)} />
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Components */}
          <ComponentsSidebar />
          
          {/* Center - Canvas */}
          <Canvas lastAddedComponentId={lastAddedComponentId} />
          
          {/* Right Sidebar - Properties */}
          <PropertiesPanel />
        </div>
        
        {/* Bottom Panel - Sections */}
        <div className="h-64 border-t border-gray-200 bg-white">
          <SectionsPanel />
        </div>

        {/* Template Library Modal */}
        <TemplateLibrary
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          onLoadTemplate={handleLoadTemplate}
        />

        {/* Notification Manager */}
        <NotificationManager
          notifications={notifications}
          onRemoveNotification={removeNotification}
        />

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {renderDragOverlay()}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default App;
