import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useTemplateStore } from '../../stores/templateStore';
import { SortableSectionItem } from './SortableSectionItem';

export const SectionsPanel: React.FC = () => {
  const {
    template,
    viewMode,
    selectedSectionId,
    selectSection,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
    toggleSectionLock,
    moveSection,
  } = useTemplateStore();

  const currentSections = template.views[viewMode].sections;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentSections.findIndex((section) => section.id === active.id);
      const newIndex = currentSections.findIndex((section) => section.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        moveSection(active.id as string, newIndex, viewMode);
      }
    }
  };

  const handleMoveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = currentSections.findIndex((section) => section.id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= currentSections.length) return;

    moveSection(sectionId, newIndex, viewMode);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sections</h3>
        <p className="text-sm text-gray-600">
          {viewMode === 'desktop' ? 'Desktop' : 'Mobile'} view
        </p>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={currentSections.map((section) => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {currentSections.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">📄</div>
                <p className="text-sm">No sections yet</p>
                <p className="text-xs">Add sections to see them here</p>
              </div>
            ) : (
              currentSections.map((section, index) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  index={index}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => selectSection(section.id)}
                  onRemove={() => removeSection(section.id, viewMode)}
                  onDuplicate={() => duplicateSection(section.id, viewMode)}
                  onToggleVisibility={() => toggleSectionVisibility(section.id, viewMode)}
                  onToggleLock={() => toggleSectionLock(section.id, viewMode)}
                  onMoveUp={() => handleMoveSection(section.id, 'up')}
                  onMoveDown={() => handleMoveSection(section.id, 'down')}
                  isFirst={index === 0}
                  isLast={index === currentSections.length - 1}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>

      {currentSections.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>• Click to select section</p>
            <p>• Use eye icon to toggle visibility</p>
            <p>• Use lock icon to prevent editing</p>
            <p>• Drag to reorder sections</p>
          </div>
        </div>
      )}
    </div>
  );
}; 