/*
  Warnings:

  - The primary key for the `OrderOnProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OrderOnProducts" DROP CONSTRAINT "OrderOnProducts_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "OrderOnProducts_pkey" PRIMARY KEY ("id");
