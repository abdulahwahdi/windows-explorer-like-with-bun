export enum NodeType {
  FILE = 'FILE',
  FOLDER = 'FOLDER'
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  size?: bigint | null;
  mimeType?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FileSystemNodeTree extends FileSystemNode {
  children?: FileSystemNodeTree[];
}