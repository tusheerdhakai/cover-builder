import type { ComponentConfig } from '../types/components';

export const COMPONENT_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
} as const;

export const COMPONENT_CONFIGS: Record<string, ComponentConfig> = {
  [COMPONENT_TYPES.TEXT]: {
    type: COMPONENT_TYPES.TEXT,
    name: 'Text',
    icon: 'Type',
    defaultProperties: {
      content: 'Enter your text here',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#333333',
      textAlign: 'left',
      lineHeight: '1.5',
      fontFamily: 'Arial, sans-serif',
      padding: '',
      margin: '0px',
    },
    defaultPosition: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
    },
  },
  [COMPONENT_TYPES.IMAGE]: {
    type: COMPONENT_TYPES.IMAGE,
    name: 'Image',
    icon: 'Image',
    defaultProperties: {
      src: '',
      alt: 'Image description',
      imageWidth: '100%',
      imageHeight: 'auto',
      padding: '',
      margin: '0px',
    },
    defaultPosition: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
    },
  },
  [COMPONENT_TYPES.BUTTON]: {
    type: COMPONENT_TYPES.BUTTON,
    name: 'Button',
    icon: 'Square',
    defaultProperties: {
      buttonText: 'Click me',
      linkUrl: '#',
      buttonBackgroundColor: '#007bff',
      buttonTextColor: '#ffffff',
      buttonPadding: '12px 24px',
      padding: '',
      margin: '0px',
      borderRadius: '4px',
    },
    defaultPosition: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
    },
  },
}; 