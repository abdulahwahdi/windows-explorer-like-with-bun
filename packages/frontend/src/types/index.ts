export enum NodeType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  size?: bigint | null;
  mimeType?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileSystemNodeTree extends FileSystemNode {
  children?: FileSystemNodeTree[];
  isOpen?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasMore?: boolean;
    query?: string;
    count?: number;
  };
}