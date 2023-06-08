import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateEvaluateDto } from 'src/evaluate/dtos/create.evaluate.dto';
import { UpdateEvaluateDto } from 'src/evaluate/dtos/update.evaluate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class EvaluateService {
  constructor(private prisma: PrismaService) {}
  async createEvalue(dto: CreateEvaluateDto, userId: number) {
    return await this.prisma.evaluate.create({
      data: {
        ...dto,
        userId: userId,
      },
    });
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
  async deleteEvaluate(evalueId: number) {
    try {
      await this.prisma.evaluate.delete({
        where: {
          id: evalueId,
        },
      });
    } catch (error) {
      throw new BadRequestException('something went wrong');
    }
  }
}
