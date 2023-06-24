/*
  Warnings:

  - You are about to drop the column `CategoryName` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `SumComment` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductOnCategoryProducrs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryName` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductOnCategoryProducrs" DROP CONSTRAINT "ProductOnCategoryProducrs_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductOnCategoryProducrs" DROP CONSTRAINT "ProductOnCategoryProducrs_productId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "CategoryName",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "SumComment",
ADD COLUMN     "sumComment" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "ProductOnCategoryProducrs";

-- CreateTable
CREATE TABLE "ProductOnCategoryProducts" (
    "productId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "ProductOnCategoryProducts_pkey" PRIMARY KEY ("productId","categoryId")
);

-- AddForeignKey
ALTER TABLE "ProductOnCategoryProducts" ADD CONSTRAINT "ProductOnCategoryProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnCategoryProducts" ADD CONSTRAINT "ProductOnCategoryProducts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
