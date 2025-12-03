import type { FileSystemService } from '../../application/services/FileSystemService';
import { NodeType } from '../../domain/entities/FileSystemNode';
import type { FileSystemNode, FileSystemNodeTree } from '../../domain/entities/FileSystemNode';

// Helper function to convert BigInt to string for JSON serialization
function serializeNode(node: FileSystemNode | FileSystemNodeTree): any {
  return {
    ...node,
    size: node.size ? node.size.toString() : null,
  };
}

function serializeNodes(nodes: (FileSystemNode | FileSystemNodeTree)[]): any[] {
  return nodes.map(node => {
    const serialized = serializeNode(node);
    if ('children' in node && node.children) {
      serialized.children = serializeNodes(node.children);
    }
    return serialized;
  });
}

export class FileSystemController {
  constructor(private service: FileSystemService) {}

  async getAllNodes() {
    try {
      const nodes = await this.service.getAllNodes();
      return {
        success: true,
        data: serializeNodes(nodes),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getFolderTree() {
    try {
      const tree = await this.service.getFolderTree();
      return {
        success: true,
        data: serializeNodes(tree),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getNodeById(id: string) {
    try {
      const node = await this.service.getNodeById(id);
      
      if (!node) {
        return {
          success: false,
          error: 'Node not found',
        };
      }

      return {
        success: true,
        data: serializeNode(node),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getChildren(parentId: string | null, limit?: number, offset?: number) {
    try {
      const result = await this.service.getChildren({
        parentId,
        limit,
        offset,
      });

      return {
        success: true,
        data: serializeNodes(result.nodes),
        meta: {
          total: result.total,
          limit: limit || 100,
          offset: offset || 0,
          hasMore: result.hasMore,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async searchNodes(query: string, limit?: number) {
    try {
      const nodes = await this.service.searchNodes({ query, limit });
      
      return {
        success: true,
        data: serializeNodes(nodes),
        meta: {
          query,
          count: nodes.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createNode(body: any) {
    try {
      const { name, type, parentId, size, mimeType } = body;

      if (!name || !type) {
        return {
          success: false,
          error: 'Name and type are required',
        };
      }

      if (!Object.values(NodeType).includes(type)) {
        return {
          success: false,
          error: 'Invalid node type',
        };
      }

      const node = await this.service.createNode({
        name,
        type,
        parentId: parentId || null,
        size: size ? BigInt(size) : null,
        mimeType: mimeType || null,
      });

      return {
        success: true,
        data: serializeNode(node),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateNode(id: string, body: any) {
    try {
      const { name, type, parentId, size, mimeType } = body;
      const updates: any = {};

      if (name !== undefined) updates.name = name;
      if (type !== undefined) updates.type = type;
      if (parentId !== undefined) updates.parentId = parentId;
      if (size !== undefined) updates.size = BigInt(size);
      if (mimeType !== undefined) updates.mimeType = mimeType;

      const node = await this.service.updateNode(id, updates);

      return {
        success: true,
        data: serializeNode(node),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async deleteNode(id: string) {
    try {
      await this.service.deleteNode(id);

      return {
        success: true,
        message: 'Node deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}