import type { Template, Layer } from '../types/template';

export const generateHTML = (template: Template, viewMode: 'desktop' | 'mobile'): string => {
  const currentView = template.views[viewMode];
  const isMobile = viewMode === 'mobile';
  
  const containerWidth = isMobile ? '100%' : `${template.settings.width}px`;
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: ${template.settings.defaultFont};
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: ${containerWidth};
            margin: 0 auto;
            background-color: ${template.settings.backgroundColor};
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .email-content {
            position: relative;
            min-height: 500px;
        }
        .layer {
            position: absolute;
        }
        .text-layer {
            word-wrap: break-word;
        }
        .image-layer img {
            max-width: 100%;
            height: auto;
        }
        .button-layer a {
            display: inline-block;
            text-decoration: none;
        }
        .row-layer {
            display: flex;
            flex-wrap: wrap;
        }
        .row-layer .column {
            flex: 1;
        }
        @media (max-width: 768px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .row-layer {
                flex-direction: column;
            }
            .row-layer .column {
                flex: none;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-content">
`;

  // Sort layers by z-index
  const sortedLayers = currentView.layers
    .filter(layer => layer.visible)
    .sort((a, b) => a.zIndex - b.zIndex);

  sortedLayers.forEach(layer => {
    const style = generateLayerStyles(layer);
    
    switch (layer.type) {
      case 'text':
        html += `
            <div class="layer text-layer" style="${style}">
                ${layer.properties.content || 'Text content'}
            </div>`;
        break;
        
      case 'image':
        if (layer.properties.src) {
          html += `
            <div class="layer image-layer" style="${style}">
                <img src="${layer.properties.src}" alt="${layer.properties.alt || ''}" style="width: 100%; height: auto;">
            </div>`;
        }
        break;
        
      case 'button':
        html += `
            <div class="layer button-layer" style="${style}">
                <a href="${layer.properties.linkUrl || '#'}" style="
                    background-color: ${layer.properties.buttonBackgroundColor || '#007bff'};
                    color: ${layer.properties.buttonTextColor || '#ffffff'};
                    padding: ${layer.properties.buttonPadding || '12px 24px'};
                    border-radius: ${layer.properties.borderRadius || '4px'};
                    text-decoration: none;
                    display: inline-block;
                    font-size: ${layer.properties.fontSize || '16px'};
                    font-weight: ${layer.properties.fontWeight || 'normal'};
                ">
                    ${layer.properties.buttonText || 'Click me'}
                </a>
            </div>`;
        break;
        
      case 'row': {
        const columns = layer.properties.columns || 2;
        const columnSpacing = layer.properties.columnSpacing || '20px';
        html += `
            <div class="layer row-layer" style="${style}">
                ${Array.from({ length: columns }).map((_, index) => `
                    <div class="column" style="margin-right: ${index < columns - 1 ? columnSpacing : '0'};">
                        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 0px; text-align: center; color: #6c757d; font-size: 14px;">
                            Column ${index + 1}
                        </div>
                    </div>
                `).join('')}
            </div>`;
        break;
      }
    }
  });

  html += `
        </div>
    </div>
</body>
</html>`;

  return html;
};

const generateLayerStyles = (layer: Layer): string => {
  const { position, properties } = layer;
  
  const styles = [
    `left: ${position.x}px`,
    `top: ${position.y}px`,
    `width: ${typeof position.width === 'number' ? position.width + 'px' : position.width}`,
    `height: ${typeof position.height === 'number' ? position.height + 'px' : position.height}`,
    `z-index: ${layer.zIndex}`,
  ];

  // Add common properties
  if (properties.padding) styles.push(`padding: ${properties.padding}`);
  if (properties.margin) styles.push(`margin: ${properties.margin}`);
  if (properties.backgroundColor) styles.push(`background-color: ${properties.backgroundColor}`);
  if (properties.border) styles.push(`border: ${properties.border}`);
  if (properties.borderRadius) styles.push(`border-radius: ${properties.borderRadius}`);

  // Add text-specific properties
  if (layer.type === 'text') {
    if (properties.fontSize) styles.push(`font-size: ${properties.fontSize}`);
    if (properties.fontWeight) styles.push(`font-weight: ${properties.fontWeight}`);
    if (properties.color) styles.push(`color: ${properties.color}`);
    if (properties.textAlign) styles.push(`text-align: ${properties.textAlign}`);
    if (properties.lineHeight) styles.push(`line-height: ${properties.lineHeight}`);
    if (properties.fontFamily) styles.push(`font-family: ${properties.fontFamily}`);
  }

  return styles.join('; ');
};

export const downloadHTML = (html: string, filename: string): void => {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}; 