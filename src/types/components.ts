import type { ComponentProperties, ComponentPosition } from './template';

export interface BaseComponent {
  id: string;
  type: ComponentType;
  name: string;
  properties: ComponentProperties;
  position: ComponentPosition;
}

export type ComponentType = 'text' | 'image' | 'button';

export interface TextComponent extends BaseComponent {
  type: 'text';
  properties: ComponentProperties & {
    content: string;
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: string;
    textDecoration?: string;
    fontFamily?: string;
  };
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  properties: ComponentProperties & {
    src: string;
    alt: string;
    imageWidth: string | number;
    imageHeight: string | number;
  };
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  properties: ComponentProperties & {
    buttonText: string;
    linkUrl: string;
    buttonBackgroundColor: string;
    buttonTextColor: string;
    buttonPadding: string;
  };
}

export type EmailComponent = TextComponent | ImageComponent | ButtonComponent;

export interface ComponentConfig {
  type: ComponentType;
  name: string;
  icon: string;
  defaultProperties: ComponentProperties;
  defaultPosition: ComponentPosition;
} 