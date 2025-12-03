import axios, { type AxiosInstance } from 'axios';
import type { FileSystemNode, FileSystemNodeTree, ApiResponse } from '@/types';
import { NodeType } from '@/types';

class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api/v1') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getAllNodes(): Promise<FileSystemNode[]> {
    const response = await this.client.get<ApiResponse<FileSystemNode[]>>('/nodes');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch nodes');
    }
    return response.data.data;
  }

  async getFolderTree(): Promise<FileSystemNodeTree[]> {
    const response = await this.client.get<ApiResponse<FileSystemNodeTree[]>>('/folders/tree');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch folder tree');
    }
    return response.data.data;
  }

  async getNodeById(id: string): Promise<FileSystemNode> {
    const response = await this.client.get<ApiResponse<FileSystemNode>>(`/nodes/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch node');
    }
    return response.data.data;
  }

  async getChildren(
    parentId: string | null,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ nodes: FileSystemNode[]; total: number; hasMore: boolean }> {
    const id = parentId || 'root';
    const response = await this.client.get<ApiResponse<FileSystemNode[]>>(
      `/nodes/${id}/children`,
      { params: { limit, offset } }
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch children');
    }

    return {
      nodes: response.data.data,
      total: response.data.meta?.total || 0,
      hasMore: response.data.meta?.hasMore || false,
    };
  }

  async searchNodes(query: string, limit: number = 50): Promise<FileSystemNode[]> {
    const response = await this.client.get<ApiResponse<FileSystemNode[]>>('/search', {
      params: { q: query, limit },
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to search nodes');
    }

    return response.data.data;
  }

  async createNode(data: {
    name: string;
    type: NodeType;
    parentId: string | null;
    mimeType?: string | null;
    size?: number | null;
  }): Promise<FileSystemNode> {
    const response = await this.client.post<ApiResponse<FileSystemNode>>('/nodes', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create node');
    }

    return response.data.data;
  }

  async updateNode(id: string, data: {
    name?: string;
    mimeType?: string | null;
    size?: number | null;
  }): Promise<FileSystemNode> {
    const response = await this.client.put<ApiResponse<FileSystemNode>>(`/nodes/${id}`, data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to update node');
    }

    return response.data.data;
  }

  async deleteNode(id: string): Promise<void> {
    const response = await this.client.delete<ApiResponse<void>>(`/nodes/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete node');
    }
  }
}

export const apiService = new ApiService();