import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateEvaluateDto } from 'src/evaluate/dtos/create.evaluate.dto';
import { UpdateEvaluateDto } from 'src/evaluate/dtos/update.evaluate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class EvaluateService {
  constructor(private prisma: PrismaService) {}
  async createEvalue(dto: CreateEvaluateDto, userId: number) {
    const e = await this.prisma.evaluate.create({
      data: {
        ...dto,
        userId: userId,
      },
    });
    // find product
    const productFind = await this.prisma.product.findUnique({
      where: {
        id: dto.productId,
      },
    });
    if (e != null) {
      const sumComment = productFind.sumComment + 1;
      const sumEvaluate = productFind.sumEvaluate + 1;
      await this.prisma.product.update({
        where: {
          id: dto.productId,
        },
        data: {
          sumEvaluate: sumEvaluate,
          sumComment: sumComment,
        },
      });
      return e;
    }
  }
  async updateEvaluate(evaluateId: number, dto: UpdateEvaluateDto) {
    try {
      const evalue = await this.prisma.evaluate.update({
        where: {
          id: evaluateId,
        },
        data: {
          comment: dto.comment ? dto.comment : undefined,
          starts: dto.starts ? dto.starts : undefined,
          productId: dto.productId ? dto.productId : undefined,
        },
      });
      return evalue;
    } catch (error) {
      throw new BadRequestException('some thing went wrong');
    }
  }
  // delete evaluate
  async deleteEvaluate(eId: number) {
    try {
      await this.prisma.evaluate.delete({
        where: {
          id: eId,
        },
      });
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }
  // get all evaluate
  async getAllEvaluate(userId: number) {
    try {
      const allEvaluate = await this.prisma.evaluate.findMany({
        where: {
          userId: userId,
        },
      });
      return allEvaluate;
    } catch (error) {
      throw new BadRequestException('co gi do sai o day');
    }
  }
}
