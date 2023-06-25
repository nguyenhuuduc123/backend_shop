/*
  Warnings:

  - You are about to drop the column `paied` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paied",
ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;
