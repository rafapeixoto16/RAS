export interface Image {
  id: number;
  imageUrl: string;
}

export interface Tool {
  filterName: string;
  args: Record<string, unknown>;
}

export interface Project {
  _id: string;
  userId: string;
  name: string;
  tools: Tool[];
  images: Image[];
  result: string | null
  ttl?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToolOption {
  type: string;
  default?: number | string | boolean;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  enum?: string[];
}

export interface ToolSchema {
  type: string;
  properties: Record<string, ToolOption>;
  required?: string[];
  additionalProperties: boolean;
}

export interface FilterParameter {
  isPremium: boolean;
  schema: {
    $ref: string;
    definitions: Record<string, ToolSchema>;
    $schema: string;
  };
}

export interface FilterParameters {
  [key: string]: FilterParameter;
}