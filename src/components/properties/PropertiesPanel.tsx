import React from 'react';
import { useTemplateStore } from '../../stores/templateStore';
import { RichTextEditor } from '../components/RichTextEditor';
import { ImageUpload } from '../components/ImageUpload';
import SpacingControl from './SpacingControl';

// Smart Spacing Control Component
export const PropertiesPanel: React.FC = () => {
    const { template, selectedSectionId, selectedRowId, selectedComponentId, viewMode, updateSection, updateRow, updateComponent } = useTemplateStore();

    // Find the selected section, row, and component
    const selectedSection = template.views[viewMode].sections.find((section) => section.id === selectedSectionId);

    const selectedRow = selectedSection?.rows.find((row) => row.id === selectedRowId);

    const selectedComponent = selectedRow?.components.find((component) => component.id === selectedComponentId);

    // If nothing is selected, show empty state
    if (!selectedSection && !selectedRow && !selectedComponent) {
        return (
            <div className='w-80 bg-white border-l border-gray-200 p-4'>
                <div className='text-center text-gray-500'>
                    <div className='text-2xl mb-2'>⚙️</div>
                    <p className='text-sm'>Select a section, row, or component to edit its properties</p>
                </div>
            </div>
        );
    }

    // Render section properties
    if (selectedSection && !selectedRow && !selectedComponent) {
        return (
            <div className='w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto'>
                <div className='mb-6'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                            <span className='text-blue-600 text-sm font-semibold'>S</span>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900'>{selectedSection.name}</h3>
                            <p className='text-sm text-gray-600'>Section Properties</p>
                        </div>
                    </div>
                </div>

                <div className='space-y-6'>
                    {/* Basic Info */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Basic Information</h4>
                        <div className='space-y-3'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Section Name</label>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={selectedSection.name}
                                    onChange={(e) => updateSection(selectedSection.id, { name: e.target.value }, viewMode)}
                                    placeholder='Enter section name...'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Rows Count</label>
                                    <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>
                                        {selectedSection.rows.length} row{selectedSection.rows.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                    <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>{selectedSection.visible ? 'Visible' : 'Hidden'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout Settings */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Layout Settings</h4>
                        <div className='space-y-3'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Section Visibility</label>
                                <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>
                                    {selectedSection.visible ? 'Visible' : 'Hidden'}
                                </div>
                            </div>
                            
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Section Lock Status</label>
                                <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>
                                    {selectedSection.locked ? 'Locked' : 'Unlocked'}
                                </div>
                            </div>

                            <SpacingControl
                                label='Section Padding'
                                value={selectedSection.properties?.padding || ''}
                                onChange={(value) =>
                                    updateSection(
                                        selectedSection.id,
                                        {
                                            properties: { ...selectedSection.properties, padding: value },
                                        },
                                        viewMode
                                    )
                                }
                                placeholder='20px'
                            />

                            <SpacingControl
                                label='Section Margin'
                                value={selectedSection.properties?.margin || ''}
                                onChange={(value) =>
                                    updateSection(
                                        selectedSection.id,
                                        {
                                            properties: { ...selectedSection.properties, margin: value },
                                        },
                                        viewMode
                                    )
                                }
                                placeholder='0px'
                            />

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Background Color</label>
                                <input
                                    type='color'
                                    className='w-full h-10 border border-gray-300 rounded-md'
                                    value={selectedSection.properties?.backgroundColor || '#ffffff'}
                                    onChange={(e) =>
                                        updateSection(
                                            selectedSection.id,
                                            {
                                                properties: { ...selectedSection.properties, backgroundColor: e.target.value },
                                            },
                                            viewMode
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Quick Actions</h4>
                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                className='px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
                                onClick={() => {
                                    // Add a new row to this section
                                    // This would need to be implemented in the store
                                }}
                            >
                                Add Row
                            </button>
                            <button
                                className='px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                                onClick={() => {
                                    // Duplicate this section
                                    // This would need to be implemented in the store
                                }}
                            >
                                Duplicate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render row properties
    if (selectedRow && !selectedComponent) {
        return (
            <div className='w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto'>
                <div className='mb-6'>
                    <div className='flex items-center gap-3 mb-2'>
                        <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center'>
                            <span className='text-green-600 text-sm font-semibold'>R</span>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold text-gray-900'>{selectedRow.name}</h3>
                            <p className='text-sm text-gray-600'>Row Properties</p>
                        </div>
                    </div>
                </div>

                <div className='space-y-6'>
                    {/* Basic Info */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Basic Information</h4>
                        <div className='space-y-3'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Row Name</label>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={selectedRow.name}
                                    onChange={(e) => updateRow(selectedSection!.id, selectedRow.id, { name: e.target.value }, viewMode)}
                                    placeholder='Enter row name...'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Components</label>
                                    <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>
                                        {selectedRow.components.length} component{selectedRow.components.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                    <div className='text-sm text-gray-600 bg-white px-3 py-2 border border-gray-300 rounded-md'>{selectedRow.visible ? 'Visible' : 'Hidden'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout Settings */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Layout Settings</h4>
                        <div className='space-y-3'>
                            <SpacingControl
                                label='Row Padding'
                                value={selectedRow.properties.padding || ''}
                                onChange={(value) =>
                                    updateRow(
                                        selectedSection!.id,
                                        selectedRow.id,
                                        {
                                            properties: { ...selectedRow.properties, padding: value },
                                        },
                                        viewMode
                                    )
                                }
                                placeholder='10px'
                            />

                            <SpacingControl
                                label='Row Margin'
                                value={selectedRow.properties.margin || ''}
                                onChange={(value) =>
                                    updateRow(
                                        selectedSection!.id,
                                        selectedRow.id,
                                        {
                                            properties: { ...selectedRow.properties, margin: value },
                                        },
                                        viewMode
                                    )
                                }
                                placeholder='0px'
                            />

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Background Color</label>
                                <input
                                    type='color'
                                    className='w-full h-10 border border-gray-300 rounded-md'
                                    value={selectedRow.properties.backgroundColor || '#ffffff'}
                                    onChange={(e) =>
                                        updateRow(
                                            selectedSection!.id,
                                            selectedRow.id,
                                            {
                                                properties: { ...selectedRow.properties, backgroundColor: e.target.value },
                                            },
                                            viewMode
                                        )
                                    }
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Column Layout</label>
                                <select
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    value={selectedRow.properties.columns || 1}
                                    onChange={(e) =>
                                        updateRow(
                                            selectedSection!.id,
                                            selectedRow.id,
                                            {
                                                properties: { ...selectedRow.properties, columns: parseInt(e.target.value) },
                                            },
                                            viewMode
                                        )
                                    }
                                >
                                    <option value={1}>Single Column</option>
                                    <option value={2}>Two Columns</option>
                                    <option value={3}>Three Columns</option>
                                    <option value={4}>Four Columns</option>
                                </select>
                            </div>

                            {(selectedRow.properties.columns ?? 1) > 1 && (
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Column Spacing</label>
                                    <input
                                        type='text'
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        value={selectedRow.properties.columnSpacing || '20px'}
                                        onChange={(e) =>
                                            updateRow(
                                                selectedSection!.id,
                                                selectedRow.id,
                                                {
                                                    properties: { ...selectedRow.properties, columnSpacing: e.target.value },
                                                },
                                                viewMode
                                            )
                                        }
                                        placeholder='20px'
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='text-sm font-medium text-gray-700 mb-3'>Quick Actions</h4>
                        <div className='grid grid-cols-2 gap-2'>
                            <button
                                className='px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors'
                                onClick={() => {
                                    // Add a new component to this row
                                    // This would need to be implemented in the store
                                }}
                            >
                                Add Component
                            </button>
                            <button
                                className='px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors'
                                onClick={() => {
                                    // Duplicate this row
                                    // This would need to be implemented in the store
                                }}
                            >
                                Duplicate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render component properties
    if (selectedComponent) {
        const handleComponentPropertyChange = (property: string, value: string) => {
            updateComponent(
                selectedSection!.id,
                selectedRow!.id,
                selectedComponent.id,
                {
                    properties: {
                        ...selectedComponent.properties,
                        [property]: value,
                    },
                },
                viewMode
            );
        };

        const renderTextProperties = () => (
            <div className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Content</label>
                    <RichTextEditor value={selectedComponent.properties.content || ''} onChange={(value) => handleComponentPropertyChange('content', value)} placeholder='Enter your text here...' />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Font Size</label>
                        <input
                            type='text'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={selectedComponent.properties.fontSize || ''}
                            onChange={(e) => handleComponentPropertyChange('fontSize', e.target.value)}
                            placeholder='16px'
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Font Weight</label>
                        <select
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={selectedComponent.properties.fontWeight || 'normal'}
                            onChange={(e) => handleComponentPropertyChange('fontWeight', e.target.value)}
                        >
                            <option value='normal'>Normal</option>
                            <option value='bold'>Bold</option>
                            <option value='100'>100</option>
                            <option value='200'>200</option>
                            <option value='300'>300</option>
                            <option value='400'>400</option>
                            <option value='500'>500</option>
                            <option value='600'>600</option>
                            <option value='700'>700</option>
                            <option value='800'>800</option>
                            <option value='900'>900</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Color</label>
                    <input
                        type='color'
                        className='w-full h-10 border border-gray-300 rounded-md'
                        value={selectedComponent.properties.color || '#000000'}
                        onChange={(e) => handleComponentPropertyChange('color', e.target.value)}
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Text Align</label>
                    <select
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={selectedComponent.properties.textAlign || 'left'}
                        onChange={(e) => handleComponentPropertyChange('textAlign', e.target.value)}
                    >
                        <option value='left'>Left</option>
                        <option value='center'>Center</option>
                        <option value='right'>Right</option>
                        <option value='justify'>Justify</option>
                    </select>
                </div>

                <SpacingControl label='Padding' value={selectedComponent.properties.padding || ''} onChange={(value) => handleComponentPropertyChange('padding', value)} placeholder='10px' />

                <SpacingControl label='Margin' value={selectedComponent.properties.margin || ''} onChange={(value) => handleComponentPropertyChange('margin', value)} placeholder='0px' />

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Background Color</label>
                    <input
                        type='color'
                        className='w-full h-10 border border-gray-300 rounded-md'
                        value={selectedComponent.properties.backgroundColor || '#ffffff'}
                        onChange={(e) => handleComponentPropertyChange('backgroundColor', e.target.value)}
                    />
                </div>
            </div>
        );

        const renderImageProperties = () => (
            <div className='space-y-4'>
                <ImageUpload
                    value={selectedComponent.properties.src || ''}
                    onChange={(value) => handleComponentPropertyChange('src', value)}
                    onAltChange={(value) => handleComponentPropertyChange('alt', value)}
                    altText={selectedComponent.properties.alt || ''}
                />

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Width</label>
                        <input
                            type='text'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={selectedComponent.properties.imageWidth || ''}
                            onChange={(e) => handleComponentPropertyChange('imageWidth', e.target.value)}
                            placeholder='100%'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Height</label>
                        <input
                            type='text'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={selectedComponent.properties.imageHeight || ''}
                            onChange={(e) => handleComponentPropertyChange('imageHeight', e.target.value)}
                            placeholder='auto'
                        />
                    </div>
                </div>

                <SpacingControl label='Padding' value={selectedComponent.properties.padding || ''} onChange={(value) => handleComponentPropertyChange('padding', value)} placeholder='10px' />

                <SpacingControl label='Margin' value={selectedComponent.properties.margin || ''} onChange={(value) => handleComponentPropertyChange('margin', value)} placeholder='0px' />

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Background Color</label>
                    <input
                        type='color'
                        className='w-full h-10 border border-gray-300 rounded-md'
                        value={selectedComponent.properties.backgroundColor || '#ffffff'}
                        onChange={(e) => handleComponentPropertyChange('backgroundColor', e.target.value)}
                    />
                </div>
            </div>
        );

        const renderButtonProperties = () => (
            <div className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Button Text</label>
                    <input
                        type='text'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={selectedComponent.properties.buttonText || ''}
                        onChange={(e) => handleComponentPropertyChange('buttonText', e.target.value)}
                        placeholder='Click me'
                    />
                </div>

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Link URL</label>
                    <input
                        type='url'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={selectedComponent.properties.linkUrl || ''}
                        onChange={(e) => handleComponentPropertyChange('linkUrl', e.target.value)}
                        placeholder='https://example.com'
                    />
                </div>

                <SpacingControl label='Padding' value={selectedComponent.properties.padding || ''} onChange={(value) => handleComponentPropertyChange('padding', value)} placeholder='10px' />

                <SpacingControl label='Margin' value={selectedComponent.properties.margin || ''} onChange={(value) => handleComponentPropertyChange('margin', value)} placeholder='0px' />

                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Background Color</label>
                    <input
                        type='color'
                        className='w-full h-10 border border-gray-300 rounded-md'
                        value={selectedComponent.properties.buttonBackgroundColor || '#007bff'}
                        onChange={(e) => handleComponentPropertyChange('buttonBackgroundColor', e.target.value)}
                    />
                </div>
            </div>
        );

        const renderComponentProperties = () => {
            switch (selectedComponent.type) {
                case 'text':
                    return renderTextProperties();
                case 'image':
                    return renderImageProperties();
                case 'button':
                    return renderButtonProperties();
                default:
                    return <div>Unknown component type</div>;
            }
        };

        return (
            <div className='w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto'>
                <div className='mb-4'>
                    <h3 className='text-lg font-semibold text-gray-900 mb-1'>{selectedComponent.name}</h3>
                    <p className='text-sm text-gray-600 capitalize'>{selectedComponent.type} Component</p>
                </div>

                <div className='space-y-6'>{renderComponentProperties()}</div>
            </div>
        );
    }

    return (
        <div className='w-80 bg-white border-l border-gray-200 p-4'>
            <div className='text-center text-gray-500'>
                <div className='text-2xl mb-2'>⚙️</div>
                <p className='text-sm'>Select a section, row, or component to edit its properties</p>
            </div>
        </div>
    );
};
