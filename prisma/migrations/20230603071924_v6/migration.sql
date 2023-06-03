/*
  Warnings:

  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "COLOR" AS ENUM ('BLACK', 'RED', 'WHITE', 'BLUE', 'YELLOW', 'GREEN');

-- CreateEnum
CREATE TYPE "SIZE" AS ENUM ('XS', 'S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "PAYMENTMETHOD" AS ENUM ('DIRECT', 'INDIRECT');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "avatar" TEXT[] DEFAULT ARRAY['']::TEXT[],
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "popularProduct" TEXT[],
    "quantitySold" BIGINT NOT NULL,
    "averageEvaluate" BIGINT NOT NULL,
    "SumComment" BIGINT NOT NULL,
    "sumEvaluate" BIGINT NOT NULL,
    "discount" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oder" (
    "id" SERIAL NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "paymentMethod" "PAYMENTMETHOD" NOT NULL DEFAULT 'DIRECT',
    "paied" BOOLEAN NOT NULL,
    "ordered" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Oder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryProduct" (
    "id" SERIAL NOT NULL,
    "colors" "COLOR" NOT NULL DEFAULT 'GREEN',
    "size" "SIZE" NOT NULL DEFAULT 'XL',
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "CategoryProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluate" (
    "id" SERIAL NOT NULL,
    "starts" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evaluate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProducts" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "OrderProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOnCategoryProducrs" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "ProductOnCategoryProducrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "Url" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phoneNumber_key" ON "users"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Oder" ADD CONSTRAINT "Oder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
