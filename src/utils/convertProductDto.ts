import { UpdateProductDto } from 'src/product/dto/update.product.dto';

export function convertProductDto(updateProductDto: UpdateProductDto) {
  return {
    productName: updateProductDto.productName
      ? updateProductDto.productName
      : undefined,
    description: updateProductDto.description
      ? updateProductDto.description
      : undefined,
    price: updateProductDto.price ? updateProductDto.price : undefined,
    popularProduct:
      updateProductDto.popularProduct != null
        ? updateProductDto.popularProduct
        : undefined,
    quantitySold:
      updateProductDto.quantitySold != null
        ? updateProductDto.quantitySold
        : undefined,
    sumEvaluate:
      updateProductDto.sumEvaluate != null
        ? updateProductDto.sumEvaluate
        : undefined,
    averageEvaluate:
      updateProductDto.averageEvaluate != null
        ? updateProductDto.averageEvaluate
        : undefined,
    SumComment:
      updateProductDto.SumComment != null
        ? updateProductDto.SumComment
        : undefined,
    discount:
      updateProductDto.discount != null ? updateProductDto.discount : undefined,
    status:
      updateProductDto.status != null ? updateProductDto.status : undefined,
  };
}
