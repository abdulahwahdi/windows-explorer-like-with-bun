-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('FILE', 'FOLDER');

-- CreateTable
CREATE TABLE "file_system_nodes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "parent_id" TEXT,
    "size" BIGINT,
    "mime_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_system_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "file_system_nodes_parent_id_idx" ON "file_system_nodes"("parent_id");

-- CreateIndex
CREATE INDEX "file_system_nodes_name_idx" ON "file_system_nodes"("name");

-- CreateIndex
CREATE INDEX "file_system_nodes_type_idx" ON "file_system_nodes"("type");

-- CreateIndex
CREATE INDEX "file_system_nodes_parent_id_type_idx" ON "file_system_nodes"("parent_id", "type");

-- AddForeignKey
ALTER TABLE "file_system_nodes" ADD CONSTRAINT "file_system_nodes_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "file_system_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
