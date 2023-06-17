import { CreateEvaluateDto } from 'src/evaluate/dtos/create.evaluate.dto';
import { EvaluateService } from './../../service/evaluate/evaluate.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userid-at.decorator';
import { UpdateEvaluateDto } from 'src/evaluate/dtos/update.evaluate.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';

@Controller('evaluate')
export class EvaluateController {
  constructor(private evaluateService: EvaluateService) {}
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Post('create')
  async createEvaluate(
    @Body() dto: CreateEvaluateDto,
    @GetCurrentUserIdByAT('sub') userId: string,
  ) {
    return await this.evaluateService.createEvalue(dto, Number(userId));
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteEvaluate(@Param('id') id: string) {
    return this.evaluateService.deleteEvaluate(Number(id));
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateProduct(@Body() dto: UpdateEvaluateDto, @Param('id') id: string) {
    return await this.evaluateService.updateEvaluate(Number(id), dto);
  }
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(RolesGuard)
  @Get('allEvaluate')
  async getAllEvaluate(@GetCurrentUserIdByAT('sub') userId: string) {
    return await this.evaluateService.getAllEvaluate(Number(userId));
  }
}
