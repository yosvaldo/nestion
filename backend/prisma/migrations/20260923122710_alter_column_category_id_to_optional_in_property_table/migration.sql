-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_category_id_fkey";

-- AlterTable
ALTER TABLE "properties" ALTER COLUMN "category_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
