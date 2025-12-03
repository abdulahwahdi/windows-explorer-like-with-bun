import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { PrismaFileSystemRepository } from './infrastructure/repositories/PrismaFileSystemRepository';
import { FileSystemService } from './application/services/FileSystemService';
import { FileSystemController } from './presentation/controllers/FileSystemController';

// Initialize dependencies
const repository = new PrismaFileSystemRepository();
const service = new FileSystemService(repository);
const controller = new FileSystemController(service);

// Create Elysia app
const app = new Elysia()
  .use(cors())
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  
  // API v1 Routes
  .group('/api/v1', (app) =>
    app
      // Get all nodes (typically for initial load)
      .get('/nodes', () => controller.getAllNodes())
      
      // Get folder tree structure
      .get('/folders/tree', () => controller.getFolderTree())
      
      // Get specific node by ID
      .get('/nodes/:id', ({ params }) => controller.getNodeById(params.id))
      
      // Get children of a folder
      .get('/nodes/:id/children', ({ params, query }) => {
        const parentId = params.id === 'root' ? null : params.id;
        const limit = query.limit ? parseInt(query.limit as string) : undefined;
        const offset = query.offset ? parseInt(query.offset as string) : undefined;
        return controller.getChildren(parentId, limit, offset);
      })
      
      // Search nodes
      .get('/search', ({ query }) => {
        const searchQuery = query.q as string || '';
        const limit = query.limit ? parseInt(query.limit as string) : undefined;
        return controller.searchNodes(searchQuery, limit);
      })
      
      // Create new node
      .post('/nodes', ({ body }) => controller.createNode(body))
      
      // Update node
      .put('/nodes/:id', ({ params, body }) => controller.updateNode(params.id, body))
      
      // Delete node
      .delete('/nodes/:id', ({ params }) => controller.deleteNode(params.id))
  )
  
  .listen(3000);

console.log(`🦊 Server running at http://${app.server?.hostname}:${app.server?.port}`);