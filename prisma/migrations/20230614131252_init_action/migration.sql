-- DropForeignKey
ALTER TABLE "OrderOnProducts" DROP CONSTRAINT "OrderOnProducts_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderOnProducts" DROP CONSTRAINT "OrderOnProducts_productId_fkey";

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnProducts" ADD CONSTRAINT "OrderOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
