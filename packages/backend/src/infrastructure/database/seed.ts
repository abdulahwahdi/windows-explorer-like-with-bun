import { prisma } from './prisma';
import { NodeType } from '../../domain/entities/FileSystemNode';

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.fileSystemNode.deleteMany();

  // Create root folders
  const documents = await prisma.fileSystemNode.create({
    data: { name: 'Documents', type: NodeType.FOLDER, parentId: null },
  });

  const projects = await prisma.fileSystemNode.create({
    data: { name: 'Projects', type: NodeType.FOLDER, parentId: null },
  });

  const downloads = await prisma.fileSystemNode.create({
    data: { name: 'Downloads', type: NodeType.FOLDER, parentId: null },
  });

  // Documents subfolders
  const work = await prisma.fileSystemNode.create({
    data: { name: 'Work', type: NodeType.FOLDER, parentId: documents.id },
  });

  const personal = await prisma.fileSystemNode.create({
    data: { name: 'Personal', type: NodeType.FOLDER, parentId: documents.id },
  });

  await prisma.fileSystemNode.create({
    data: { 
      name: 'report.pdf', 
      type: NodeType.FILE, 
      parentId: documents.id,
      size: BigInt(524288),
      mimeType: 'application/pdf'
    },
  });

  // Work subfolders
  const year2024 = await prisma.fileSystemNode.create({
    data: { name: '2024', type: NodeType.FOLDER, parentId: work.id },
  });

  const year2023 = await prisma.fileSystemNode.create({
    data: { name: '2023', type: NodeType.FOLDER, parentId: work.id },
  });

  await prisma.fileSystemNode.create({
    data: { 
      name: 'presentation.pptx', 
      type: NodeType.FILE, 
      parentId: work.id,
      size: BigInt(2097152),
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    },
  });

  // 2024 subfolders
  const q1 = await prisma.fileSystemNode.create({
    data: { name: 'Q1', type: NodeType.FOLDER, parentId: year2024.id },
  });

  const q2 = await prisma.fileSystemNode.create({
    data: { name: 'Q2', type: NodeType.FOLDER, parentId: year2024.id },
  });

  await prisma.fileSystemNode.create({
    data: { 
      name: 'budget.xlsx', 
      type: NodeType.FILE, 
      parentId: year2024.id,
      size: BigInt(131072),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    },
  });

  // Q1 files
  await prisma.fileSystemNode.createMany({
    data: [
      { name: 'january.docx', type: NodeType.FILE, parentId: q1.id, size: BigInt(65536), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { name: 'february.docx', type: NodeType.FILE, parentId: q1.id, size: BigInt(73728), mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    ],
  });

  // Personal subfolders
  await prisma.fileSystemNode.createMany({
    data: [
      { name: 'Photos', type: NodeType.FOLDER, parentId: personal.id },
      { name: 'Videos', type: NodeType.FOLDER, parentId: personal.id },
      { name: 'notes.txt', type: NodeType.FILE, parentId: personal.id, size: BigInt(4096), mimeType: 'text/plain' },
    ],
  });

  // Projects subfolders
  const webapp = await prisma.fileSystemNode.create({
    data: { name: 'WebApp', type: NodeType.FOLDER, parentId: projects.id },
  });

  await prisma.fileSystemNode.create({
    data: { name: 'MobileApp', type: NodeType.FOLDER, parentId: projects.id },
  });

  // WebApp subfolders
  const src = await prisma.fileSystemNode.create({
    data: { name: 'src', type: NodeType.FOLDER, parentId: webapp.id },
  });

  await prisma.fileSystemNode.createMany({
    data: [
      { name: 'tests', type: NodeType.FOLDER, parentId: webapp.id },
      { name: 'package.json', type: NodeType.FILE, parentId: webapp.id, size: BigInt(2048), mimeType: 'application/json' },
      { name: 'README.md', type: NodeType.FILE, parentId: webapp.id, size: BigInt(8192), mimeType: 'text/markdown' },
    ],
  });

  // src subfolders
  await prisma.fileSystemNode.createMany({
    data: [
      { name: 'components', type: NodeType.FOLDER, parentId: src.id },
      { name: 'utils', type: NodeType.FOLDER, parentId: src.id },
      { name: 'index.ts', type: NodeType.FILE, parentId: src.id, size: BigInt(1024), mimeType: 'text/typescript' },
    ],
  });

  // Downloads
  await prisma.fileSystemNode.createMany({
    data: [
      { name: 'installer.exe', type: NodeType.FILE, parentId: downloads.id, size: BigInt(10485760), mimeType: 'application/x-msdownload' },
      { name: 'image.png', type: NodeType.FILE, parentId: downloads.id, size: BigInt(1048576), mimeType: 'image/png' },
      { name: 'Temp', type: NodeType.FOLDER, parentId: downloads.id },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });