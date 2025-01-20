export interface PreviewImage {
    type: 'image';
    url: string;
  }
  
  export interface PreviewJson {
    type: 'json';
    content: Record<string, unknown>;
  }
  
  export type PreviewItem = PreviewImage | PreviewJson;
  
  export interface PreviewData {
    [filename: string]: PreviewItem;
  }