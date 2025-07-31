import React from 'react';
import { useTemplateStore } from '../../stores/templateStore';
import { SectionComponent } from '../components/SectionComponent';

interface CanvasProps {
    lastAddedComponentId?: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ lastAddedComponentId }) => {
    const { template, viewMode, selectSection } = useTemplateStore();
    const currentView = template.views[viewMode];
    const isMobile = viewMode === 'mobile';

    const handleCanvasClick = (e: React.MouseEvent) => {
        // Deselect section when clicking on empty canvas
        if (e.target === e.currentTarget) {
            selectSection(null);
        }
    };

    return (
        <div className='flex-1 bg-gray-50 p-4 overflow-auto'>
            <div className='flex justify-center'>
                <div
                    className={`bg-white shadow-lg border border-gray-200 relative ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-5xl'}`}
                    style={{
                        // width: isMobile ? '375px' : `${template.settings.width}px`,
                        backgroundColor: template.settings.backgroundColor,
                        minHeight: '600px',
                    }}
                    onClick={handleCanvasClick}
                >
                    {/* Canvas Header */}
                    <div className='bg-gray-100 px-4 py-2 border-b border-gray-200 text-sm text-gray-600'>
                        {isMobile ? 'Mobile View' : 'Desktop View'} - {template.settings.width}px
                    </div>

                    {/* Canvas Content */}
                    <div className='relative p-4' style={{ minHeight: '500px' }}>
                        {currentView.sections
                            .filter((section) => section.visible)
                            .map((section) => (
                                <SectionComponent key={section.id} section={section} viewMode={viewMode} lastAddedComponentId={lastAddedComponentId} />
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
