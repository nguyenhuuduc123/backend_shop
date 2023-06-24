/*
  Warnings:

  - You are about to drop the `CategoryProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductOnCategoryProducts" DROP CONSTRAINT "ProductOnCategoryProducts_categoryId_fkey";

-- DropTable
DROP TABLE "CategoryProduct";

-- CreateTable
CREATE TABLE "CategoryProductDetail" (
    "id" SERIAL NOT NULL,
    "colors" "COLOR" NOT NULL DEFAULT 'GREEN',
    "size" "SIZE" NOT NULL DEFAULT 'XL',
    "quantity" INTEGER NOT NULL DEFAULT 100,
    "remainAmount" INTEGER,

    CONSTRAINT "CategoryProductDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductOnCategoryProducts" ADD CONSTRAINT "ProductOnCategoryProducts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryProductDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
