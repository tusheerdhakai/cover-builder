import React, { useState, useEffect } from 'react';
import { Folder, Plus, Trash2, Download, Upload, Search, Clock } from 'lucide-react';
import { storageUtils } from '../../utils/storageUtils';
import { generateHTML, downloadHTML } from '../../utils/exportUtils';
import type { Template } from '../../types/template';

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: Template) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  isOpen,
  onClose,
  onLoadTemplate,
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    const savedTemplates = storageUtils.getAllTemplates();
    setTemplates(savedTemplates);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      storageUtils.deleteTemplate(templateId);
      loadTemplates();
      if (selectedTemplate?.id === templateId) {
        setSelectedTemplate(null);
      }
    }
  };

  const handleExportTemplate = (template: Template) => {
    const html = generateHTML(template, 'desktop');
    downloadHTML(html, `${template.name.replace(/\s+/g, '_')}.html`);
  };

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template);
    onClose();
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string);
          if (template.id && template.name && template.views) {
            storageUtils.saveTemplate(template);
            loadTemplates();
          } else {
            alert('Invalid template file');
          }
        } catch {
          alert('Failed to import template');
        }
      };
      reader.readAsText(file);
    }
  };

  const exportTemplateAsJSON = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Template Library</h2>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Import Template */}
            <label className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="hidden"
              />
            </label>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Template List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              {filteredTemplates.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Folder className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No templates found</p>
                  <p className="text-sm">Create your first template to get started</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>Desktop: {template.views.desktop.sections.length} sections</span>
                            <span>Mobile: {template.views.mobile.sections.length} sections</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(template.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLoadTemplate(template);
                            }}
                            className="p-1 hover:bg-blue-100 rounded text-blue-600"
                            title="Load template"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Delete template"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Template Details */}
          <div className="w-1/2 p-4">
            {selectedTemplate ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedTemplate.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Version {selectedTemplate.version} • Created {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Desktop View</h4>
                    <p className="text-sm text-gray-600">
                      {selectedTemplate.views.desktop.sections.length} sections
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Mobile View</h4>
                    <p className="text-sm text-gray-600">
                      {selectedTemplate.views.mobile.sections.length} sections
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleLoadTemplate(selectedTemplate)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Load Template
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExportTemplate(selectedTemplate)}
                      className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export HTML
                    </button>
                    <button
                      onClick={() => exportTemplateAsJSON(selectedTemplate)}
                      className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-medium mb-2">Select a template</p>
                <p className="text-sm">Choose a template from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 