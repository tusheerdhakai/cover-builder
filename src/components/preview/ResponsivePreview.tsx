import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, X } from 'lucide-react';
import { useTemplateStore } from '../../stores/templateStore';
import type { Component, Row, Section, ViewMode } from '../../types/template';
import { TextComponent } from '../components/TextComponent';
import { ImageComponent } from '../components/ImageComponent';
import { ButtonComponent } from '../components/ButtonComponent';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceConfig {
  type: DeviceType;
  name: string;
  icon: React.ReactNode;
  width: number;
  height: number;
}

const deviceConfigs: DeviceConfig[] = [
  {
    type: 'mobile',
    name: 'Mobile',
    icon: <Smartphone className="w-4 h-4" />,
    width: 375,
    height: 667,
  },
  {
    type: 'tablet',
    name: 'Tablet',
    icon: <Tablet className="w-4 h-4" />,
    width: 768,
    height: 1024,
  },
  {
    type: 'desktop',
    name: 'Desktop',
    icon: <Monitor className="w-4 h-4" />,
    width: 1200,
    height: 800,
  },
];

interface ResponsivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  isOpen,
  onClose,
}) => {
  const { template, viewMode } = useTemplateStore();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('desktop');
  const [showAllDevices, setShowAllDevices] = useState(false);

  if (!isOpen) return null;

  const currentView = template.views[viewMode];
  const selectedConfig = deviceConfigs.find(d => d.type === selectedDevice);

  const PreviewComponent: React.FC<{ component: Component; viewMode: ViewMode }> = ({ component, viewMode }) => {
    switch (component.type) {
      case 'text':
        return <TextComponent component={component} isSelected={false} viewMode={viewMode} />;
      case 'image':
        return <ImageComponent component={component} isSelected={false} />;
      case 'button':
        return <ButtonComponent component={component} isSelected={false} viewMode={viewMode} />;
      default:
        return null;
    }
  };

  const PreviewRow: React.FC<{ row: Row; viewMode: ViewMode }> = ({ row, viewMode }) => {
    const numColumns = row.properties.columns || 1;
    const columns = Array.from({ length: numColumns }, (_, i) =>
      row.components.filter(c => (c.properties.columnIndex || 0) === i)
    );

    return (
      <div style={{
        padding: row.properties.padding,
        margin: row.properties.margin,
        backgroundColor: row.properties.backgroundColor,
        display: 'flex',
        flexDirection: row.properties.flexDirection || 'row',
        gap: row.properties.gap || row.properties.columnSpacing || '0px',
        alignItems: row.properties.alignItems || 'flex-start',
        justifyContent: row.properties.justifyContent || 'flex-start',
      }}>
        {columns.map((componentsInColumn, index) => (
          <div key={index} style={{ flex: 1, minWidth: 0 }}>
            {componentsInColumn.map(component =>
              component.visible && <PreviewComponent key={component.id} component={component} viewMode={viewMode} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const PreviewSection: React.FC<{ section: Section; viewMode: ViewMode }> = ({ section, viewMode }) => {
    return (
      <div style={{
        backgroundColor: section.properties?.backgroundColor,
        backgroundImage: section.properties?.backgroundImage ? `url(${section.properties.backgroundImage})` : undefined,
        backgroundSize: section.properties?.backgroundSize,
        backgroundPosition: section.properties?.backgroundPosition,
        backgroundRepeat: section.properties?.backgroundRepeat,
        padding: section.properties?.padding,
        margin: section.properties?.margin,
        maxWidth: section.properties?.maxWidth,
      }}>
        {section.rows.map(row => row.visible && <PreviewRow key={row.id} row={row} viewMode={viewMode} />)}
      </div>
    );
  };

  const renderDevicePreview = (device: DeviceConfig) => {
    const scale = Math.min(
      (window.innerWidth * 0.8) / device.width,
      (window.innerHeight * 0.8) / device.height
    );

    return (
      <div
        key={device.type}
        className={`bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden ${
          showAllDevices ? 'mb-8' : ''
        }`}
        style={{
          width: showAllDevices ? device.width * scale : '100%',
          height: showAllDevices ? device.height * scale : '100%',
          maxWidth: showAllDevices ? device.width * scale : 'none',
          maxHeight: showAllDevices ? device.height * scale : 'none',
        }}
      >
        {/* Device Header */}
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {device.icon}
            <span className="text-sm font-medium text-gray-700">
              {device.name} ({device.width}px)
            </span>
          </div>
          {showAllDevices && (
            <button
              onClick={() => setSelectedDevice(device.type)}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Select
            </button>
          )}
        </div>

        {/* Email Content */}
        <div
          className="relative bg-white"
          style={{
            width: '100%',
            height: 'calc(100% - 40px)',
            backgroundColor: template.settings.backgroundColor,
          }}
        >
          {currentView.sections
            .filter((section) => section.visible)
            .map((section) => (
              <PreviewSection key={section.id} section={section} viewMode={viewMode} />
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl max-h-[90vh] w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">Email Preview</h2>
            
            {/* Device Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200">
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-l-lg transition-colors ${
                  !showAllDevices
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setShowAllDevices(false)}
              >
                Single View
              </button>
              <button
                className={`px-3 py-1.5 text-sm font-medium rounded-r-lg transition-colors ${
                  showAllDevices
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setShowAllDevices(true)}
              >
                All Devices
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
          {showAllDevices ? (
            <div className="space-y-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Responsive Preview
                </h3>
                <p className="text-sm text-gray-600">
                  See how your email looks across different devices
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8">
                {deviceConfigs.map(renderDevicePreview)}
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              {selectedConfig && renderDevicePreview(selectedConfig)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Template: {template.name} • View: {viewMode} • Sections: {currentView.sections.length}
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Export HTML
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
              Send Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 