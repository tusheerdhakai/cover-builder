import React, { useState } from 'react';
import { Smartphone, Monitor, Save, Eye, Download, Folder } from 'lucide-react';
import { useTemplateStore } from '../../stores/templateStore';
import { ResponsivePreview } from '../preview/ResponsivePreview';

interface HeaderProps {
  onOpenLibrary: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLibrary }) => {
  const { viewMode, setViewMode, template } = useTemplateStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleViewModeChange = (mode: 'desktop' | 'mobile') => {
    setViewMode(mode);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="text-2xl">🏆</div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Hero Maker</h1>
            <p className="text-sm text-gray-600">Drag & Drop Hero Template Builder</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">View:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => handleViewModeChange('desktop')}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => handleViewModeChange('mobile')}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button 
            onClick={onOpenLibrary}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Folder className="w-4 h-4" />
            Library
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Template Info */}
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
        <span>Template: {template.name}</span>
        <span>•</span>
        <span>Last updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
        <span>•</span>
        <span>Sections: {template.views[viewMode].sections.length}</span>
      </div>

      {/* Responsive Preview Modal */}
      <ResponsivePreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
      />
    </header>
  );
}; 