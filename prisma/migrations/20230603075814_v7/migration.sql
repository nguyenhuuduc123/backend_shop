/*
  Warnings:

  - The primary key for the `Evaluate` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Evaluate` table. All the data in the column will be lost.
  - The primary key for the `ProductOnCategoryProducrs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ProductOnCategoryProducrs` table. All the data in the column will be lost.
  - You are about to drop the `Oder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `Evaluate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Evaluate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `ProductOnCategoryProducrs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductOnCategoryProducrs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Oder" DROP CONSTRAINT "Oder_userId_fkey";

-- AlterTable
ALTER TABLE "Evaluate" DROP CONSTRAINT "Evaluate_pkey",
DROP COLUMN "id",
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Evaluate_pkey" PRIMARY KEY ("userId", "productId");

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductOnCategoryProducrs" DROP CONSTRAINT "ProductOnCategoryProducrs_pkey",
DROP COLUMN "id",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "ProductOnCategoryProducrs_pkey" PRIMARY KEY ("productId", "categoryId");

-- DropTable
DROP TABLE "Oder";

-- DropTable
DROP TABLE "OrderProducts";

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "paymentMethod" "PAYMENTMETHOD" NOT NULL DEFAULT 'DIRECT',
    "paied" BOOLEAN NOT NULL,
    "ordered" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOnProducts" (
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "numberOf" INTEGER,
    "totalPrice" BIGINT,

    CONSTRAINT "OrderOnProducts_pkey" PRIMARY KEY ("orderId","productId")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluate" ADD CONSTRAINT "Evaluate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluate" ADD CONSTRAINT "Evaluate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnCategoryProducrs" ADD CONSTRAINT "ProductOnCategoryProducrs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnCategoryProducrs" ADD CONSTRAINT "ProductOnCategoryProducrs_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "CategoryProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
