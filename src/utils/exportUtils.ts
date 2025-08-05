import type { Template, Component, ComponentProperties } from '../types/template';

const generateStyleString = (properties: ComponentProperties | undefined): string => {
  const styles: string[] = [];
  if (!properties) return '';

  if (properties.padding) styles.push(`padding: ${properties.padding}`);
  if (properties.margin) styles.push(`margin: ${properties.margin}`);
  if (properties.backgroundColor) styles.push(`background-color: ${properties.backgroundColor}`);
  if (properties.backgroundImage) styles.push(`background-image: url('${properties.backgroundImage}')`);
  if (properties.backgroundSize) styles.push(`background-size: ${properties.backgroundSize}`);
  if (properties.backgroundPosition) styles.push(`background-position: ${properties.backgroundPosition}`);
  if (properties.backgroundRepeat) styles.push(`background-repeat: ${properties.backgroundRepeat}`);
  if (properties.border) styles.push(`border: ${properties.border}`);
  if (properties.borderRadius) styles.push(`border-radius: ${properties.borderRadius}`);
  if (properties.maxWidth) styles.push(`max-width: ${properties.maxWidth}; margin-left: auto; margin-right: auto;`);
  if (properties.minHeight) styles.push(`min-height: ${properties.minHeight}`);
  if (properties.maxHeight) styles.push(`max-height: ${properties.maxHeight}`);
  
  if (properties.display === 'flex') {
    styles.push(`display: flex`);
    if (properties.flexDirection) styles.push(`flex-direction: ${properties.flexDirection}`);
    if (properties.justifyContent) styles.push(`justify-content: ${properties.justifyContent}`);
    if (properties.alignItems) styles.push(`align-items: ${properties.alignItems}`);
    if (properties.gap) styles.push(`gap: ${properties.gap}`);
  }

  if (properties.fontSize) styles.push(`font-size: ${properties.fontSize}`);
  if (properties.fontWeight) styles.push(`font-weight: ${properties.fontWeight}`);
  if (properties.color) styles.push(`color: ${properties.color}`);
  if (properties.textAlign) styles.push(`text-align: ${properties.textAlign}`);
  if (properties.lineHeight) styles.push(`line-height: ${properties.lineHeight}`);
  if (properties.fontFamily) styles.push(`font-family: ${properties.fontFamily}`);
  if (properties.textDecoration) styles.push(`text-decoration: ${properties.textDecoration}`);

  return styles.join('; ');
};

const renderComponentHTML = (component: Component): string => {
  const { type, properties } = component;
  const wrapperStyle = generateStyleString({
    padding: properties.padding,
    margin: properties.margin,
    backgroundColor: properties.backgroundColor,
    border: properties.border,
    borderRadius: properties.borderRadius,
    textAlign: properties.textAlign,
  });

  switch (type) {
    case 'text': {
      const textStyle = generateStyleString(properties);
      return `<div style="${wrapperStyle}"><div style="${textStyle}">${properties.content || 'Text content'}</div></div>`;
    }
    case 'image': {
      const imgStyle = `width: ${properties.imageWidth || '100%'}; height: ${properties.imageHeight || 'auto'}; max-width: 100%; display: block;`;
      return `<div style="${wrapperStyle}"><img src="${properties.src || ''}" alt="${properties.alt || 'Image'}" style="${imgStyle}" /></div>`;
    }
    case 'button': {
      const buttonStyle = generateStyleString({
        backgroundColor: properties.buttonBackgroundColor,
        color: properties.buttonTextColor,
        padding: properties.buttonPadding,
        borderRadius: properties.borderRadius,
        fontSize: properties.fontSize,
        fontWeight: properties.fontWeight,
        fontFamily: properties.fontFamily,
      });
      return `<div style="${wrapperStyle}"><a href="${properties.linkUrl || '#'}" style="${buttonStyle} text-decoration: none; display: inline-block;">${properties.buttonText || 'Button'}</a></div>`;
    }
    default:
      return '';
  }
};

export const generateHTML = (template: Template, viewMode: 'desktop' | 'mobile'): string => {
  const currentView = template.views[viewMode];
  const isMobile = viewMode === 'mobile';
  
  const containerWidth = isMobile ? '100%' : `${template.settings.width}px`;

  const sectionsHTML = currentView.sections
    .filter(section => section.visible)
    .map(section => {
      const sectionStyle = generateStyleString(section.properties);
      const rowsHTML = section.rows
        .filter(row => row.visible)
        .map(row => {
          const numColumns = row.properties.columns || 1;
          const columns = Array.from({ length: numColumns }, (_, i) => 
            row.components.filter(c => (c.properties.columnIndex || 0) === i)
          );

          const rowStyle = generateStyleString({
            ...row.properties,
            display: 'flex',
            flexDirection: row.properties.flexDirection || 'row',
            gap: row.properties.gap || row.properties.columnSpacing || '0px',
          });

          const columnsHTML = columns.map(componentsInColumn => {
            const componentsHTML = componentsInColumn
              .filter(c => c.visible)
              .map(renderComponentHTML)
              .join('');
            return `<div class="column" style="flex: 1; min-width: 0;">${componentsHTML}</div>`;
          }).join('');

          return `<div class="row" style="${rowStyle}">${columnsHTML}</div>`;
        }).join('');

      return `<div class="section" style="${sectionStyle}">${rowsHTML}</div>`;
    }).join('');
  
  const html = `
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
        img {
            max-width: 100%;
            height: auto;
            display: block;
        }
        @media (max-width: 600px) {
            .email-container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .row {
                flex-direction: column !important;
            }
            .column {
                width: 100% !important;
                min-width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-content">
${sectionsHTML}
        </div>
    </div>
</body>
</html>`;

  return html;
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