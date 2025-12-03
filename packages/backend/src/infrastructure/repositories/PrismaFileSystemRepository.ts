import { prisma } from '../database/prisma';
import type { IFileSystemRepository } from '../../domain/repositories/IFileSystemRepository';
import type { FileSystemNode } from '../../domain/entities/FileSystemNode';
import { NodeType } from '../../domain/entities/FileSystemNode';

export class PrismaFileSystemRepository implements IFileSystemRepository {
  async findAll(): Promise<FileSystemNode[]> {
    const nodes = await prisma.fileSystemNode.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });
    return nodes;
  }

  async findById(id: string): Promise<FileSystemNode | null> {
    const node = await prisma.fileSystemNode.findUnique({
      where: { id },
    });
    return node;
  }

  async findByParentId(
    parentId: string | null,
    limit = 100,
    offset = 0
  ): Promise<FileSystemNode[]> {
    const nodes = await prisma.fileSystemNode.findMany({
      where: { parentId },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
      take: limit,
      skip: offset,
    });
    return nodes;
  }

  async findFolders(): Promise<FileSystemNode[]> {
    const nodes = await prisma.fileSystemNode.findMany({
      where: { type: NodeType.FOLDER },
      orderBy: { name: 'asc' },
    });
    return nodes;
  }

  async search(query: string, limit = 50): Promise<FileSystemNode[]> {
    const nodes = await prisma.fileSystemNode.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
      take: limit,
    });
    return nodes;
  }

  async countByParentId(parentId: string | null): Promise<number> {
    return await prisma.fileSystemNode.count({
      where: { parentId },
    });
  }

  async create(
    data: Omit<FileSystemNode, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<FileSystemNode> {
    const node = await prisma.fileSystemNode.create({
      data: {
        name: data.name,
        type: data.type,
        parentId: data.parentId,
        size: data.size,
        mimeType: data.mimeType,
      },
    });
    return node;
  }

  async update(id: string, data: Partial<FileSystemNode>): Promise<FileSystemNode> {
    const node = await prisma.fileSystemNode.update({
      where: { id },
      data,
    });
    return node;
  }

  async delete(id: string): Promise<void> {
    await prisma.fileSystemNode.delete({
      where: { id },
    });
  }
}