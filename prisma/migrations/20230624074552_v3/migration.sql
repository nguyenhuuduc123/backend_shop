/*
  Warnings:

  - You are about to drop the column `popularProduct` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `Url` on the `ProductImage` table. All the data in the column will be lost.
  - Added the required column `url` to the `ProductImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoryProduct" ALTER COLUMN "quantity" SET DEFAULT 100,
ALTER COLUMN "remainAmount" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "flat" SET DEFAULT false;

-- AlterTable
ALTER TABLE "OrderOnProducts" ADD COLUMN     "color" TEXT,
ADD COLUMN     "size" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "popularProduct",
ALTER COLUMN "SumComment" SET DEFAULT 0,
ALTER COLUMN "sumEvaluate" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "Url",
ADD COLUMN     "url" TEXT NOT NULL;
