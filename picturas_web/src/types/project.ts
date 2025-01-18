export interface Image {
    id: number;
    imageUrl: string;
  }
  
  export interface Project {
    _id: string;
    userId: string;
    name: string;
    tools: {
      filterName: string;
      args: Record<string, unknown>;
    }[];
    images: Image[];
    result: {
      expireDate?: Date;
      output?: string;
    };
    ttl?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  