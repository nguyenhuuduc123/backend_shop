import { CreateEvaluateDto } from 'src/evaluate/dtos/create.evaluate.dto';
import { EvaluateService } from './../../service/evaluate/evaluate.service';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GetCurrentUserIdByAT } from 'src/common/decorators/get-userid-at.decorator';
import { UpdateEvaluateDto } from 'src/evaluate/dtos/update.evaluate.dto';

@Controller('evaluate')
export class EvaluateController {
  constructor(private evaluateService: EvaluateService) {}

  @Post('create')
  async getAllEvaluate(
    @Body() dto: CreateEvaluateDto,
    @GetCurrentUserIdByAT('sub') userId: string,
  ) {
    return await this.evaluateService.createEvalue(dto, Number(userId));
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEvaluate(@Param('id') id: string) {
    return this.evaluateService.deleteEvaluate(Number(id));
  }
  // update
  @Put(':id')
  async updateProduct(@Body() dto: UpdateEvaluateDto, @Param('id') id: string) {
    return await this.evaluateService.updateEvaluate(Number(id), dto);
  }
}
