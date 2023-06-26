-- DropForeignKey
ALTER TABLE "OrderOnProducts" DROP CONSTRAINT "OrderOnProducts_productId_fkey";

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
