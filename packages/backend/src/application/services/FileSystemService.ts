import type { IFileSystemRepository } from '../../domain/repositories/IFileSystemRepository';
import type { FileSystemNode, FileSystemNodeTree } from '../../domain/entities/FileSystemNode';
import { NodeType } from '../../domain/entities/FileSystemNode';

export interface GetChildrenParams {
  parentId: string | null;
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  query: string;
  limit?: number;
}

export class FileSystemService {
  constructor(private repository: IFileSystemRepository) {}

  async getAllNodes(): Promise<FileSystemNode[]> {
    return await this.repository.findAll();
  }

  async getFolderTree(): Promise<FileSystemNodeTree[]> {
    const folders = await this.repository.findFolders();
    return this.buildTree(folders);
  }

  async getNodeById(id: string): Promise<FileSystemNode | null> {
    return await this.repository.findById(id);
  }

  async getChildren(params: GetChildrenParams): Promise<{
    nodes: FileSystemNode[];
    total: number;
    hasMore: boolean;
  }> {
    const { parentId, limit = 100, offset = 0 } = params;
    
    const [nodes, total] = await Promise.all([
      this.repository.findByParentId(parentId, limit, offset),
      this.repository.countByParentId(parentId),
    ]);

    return {
      nodes,
      total,
      hasMore: offset + nodes.length < total,
    };
  }

  async searchNodes(params: SearchParams): Promise<FileSystemNode[]> {
    const { query, limit = 50 } = params;
    
    if (!query.trim()) {
      return [];
    }

    return await this.repository.search(query, limit);
  }

  async createNode(
    data: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FileSystemNode> {
    // Validate parent exists if parentId is provided
    if (data.parentId) {
      const parent = await this.repository.findById(data.parentId);
      if (!parent) {
        throw new Error('Parent node not found');
      }
      if (parent.type !== NodeType.FOLDER) {
        throw new Error('Parent must be a folder');
      }
    }

    return await this.repository.create(data);
  }

  async updateNode(id: string, data: Partial<FileSystemNode>): Promise<FileSystemNode> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Node not found');
    }

    return await this.repository.update(id, data);
  }

  async deleteNode(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Node not found');
    }

    await this.repository.delete(id);
  }

  private buildTree(nodes: FileSystemNode[]): FileSystemNodeTree[] {
    const nodeMap = new Map<string, FileSystemNodeTree>();
    const roots: FileSystemNodeTree[] = [];

    // Create map of all nodes
    nodes.forEach(node => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    // Build tree structure
    nodes.forEach(node => {
      const treeNode = nodeMap.get(node.id)!;
      
      if (node.parentId === null) {
        roots.push(treeNode);
      } else {
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children!.push(treeNode);
        }
      }
    });

    // Sort recursively
    this.sortTree(roots);

    return roots;
  }

  private sortTree(nodes: FileSystemNodeTree[]): void {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.sortTree(node.children);
      }
    });
  }
}