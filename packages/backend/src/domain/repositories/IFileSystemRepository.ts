import { FileSystemNode } from "../entities/FileSystemNode";

export interface IFileSystemRepository {
  findAll(): Promise<FileSystemNode[]>;
  findById(id: string): Promise<FileSystemNode | null>;
  findByParentId(parentId: string | null, limit?: number, offset?: number): Promise<FileSystemNode[]>;
  findFolders(): Promise<FileSystemNode[]>;
  search(query: string, limit?: number): Promise<FileSystemNode[]>;
  countByParentId(parentId: string | null): Promise<number>;
  create(data: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<FileSystemNode>;
  update(id: string, data: Partial<FileSystemNode>): Promise<FileSystemNode>;
  delete(id: string): Promise<void>;
}
