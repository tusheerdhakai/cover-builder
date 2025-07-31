export interface TemplateSettings {
  width: number;
  backgroundColor: string;
  defaultFont: string;
}

export interface ComponentPosition {
  x: number;
  y: number;
  width: string | number;
  height: string | number;
}

export interface ComponentProperties {
  // Common properties
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  
  // Text-specific properties
  content?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string;
  textDecoration?: string;
  fontFamily?: string;
  
  // Image-specific properties
  src?: string;
  alt?: string;
  imageWidth?: string | number;
  imageHeight?: string | number;
  
  // Button-specific properties
  buttonText?: string;
  linkUrl?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonPadding?: string;
  
  // Row-specific properties
  columns?: number;
  columnSpacing?: string;
}

export interface Component {
  id: string;
  type: 'text' | 'image' | 'button';
  name: string;
  visible: boolean;
  locked: boolean;
  properties: ComponentProperties;
  position: ComponentPosition;
}

export interface Row {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  properties: ComponentProperties;
  components: Component[];
}

export interface Section {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  rows: Row[];
  properties?: ComponentProperties;
}

export interface TemplateView {
  sections: Section[];
}

export interface Template {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  settings: TemplateSettings;
  views: {
    desktop: TemplateView;
    mobile: TemplateView;
  };
}

export type ViewMode = 'desktop' | 'mobile'; 