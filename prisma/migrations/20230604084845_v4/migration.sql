/*
  Warnings:

  - The primary key for the `Evaluate` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Evaluate" DROP CONSTRAINT "Evaluate_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Evaluate_pkey" PRIMARY KEY ("id");
