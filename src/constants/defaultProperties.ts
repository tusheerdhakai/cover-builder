import type { ComponentProperties, ComponentPosition } from '../types/template';

export const DEFAULT_TEMPLATE_SETTINGS = {
  width: 1200,
  backgroundColor: '#ffffff',
  defaultFont: 'Arial, sans-serif',
};

export const DEFAULT_TEXT_PROPERTIES: ComponentProperties = {
  content: 'Enter your text here',
  fontSize: '16px',
  fontWeight: 'normal',
  color: '#333333',
  textAlign: 'left',
  lineHeight: '1.5',
  fontFamily: 'Arial, sans-serif',
  padding: '',
  margin: '0px',
};

export const DEFAULT_IMAGE_PROPERTIES: ComponentProperties = {
  src: '',
  alt: 'Image description',
  imageWidth: '100%',
  imageHeight: 'auto',
  padding: '',
  margin: '0px',
};

export const DEFAULT_BUTTON_PROPERTIES: ComponentProperties = {
  buttonText: 'Click me',
  linkUrl: '#',
  buttonBackgroundColor: '#007bff',
  buttonTextColor: '#ffffff',
  buttonPadding: '12px 24px',
  padding: '',
  margin: '0px',
  borderRadius: '4px',
};

export const DEFAULT_ROW_PROPERTIES: ComponentProperties = {
  columns: 2,
  columnSpacing: '20px',
  padding: '',
  margin: '0px',
  backgroundColor: 'transparent',
};

export const DEFAULT_POSITIONS = {
  text: { x: 0, y: 0, width: '100%', height: '100%' } as ComponentPosition,
  image: { x: 0, y: 0, width: '100%', height: '100%' } as ComponentPosition,
  button: { x: 0, y: 0, width: 'auto', height: '100%' } as ComponentPosition,
  row: { x: 0, y: 0, width: '100%', height: '100%' } as ComponentPosition,
}; 