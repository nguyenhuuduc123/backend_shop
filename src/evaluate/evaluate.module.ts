import { Module } from '@nestjs/common';
import { EvaluateController } from './controller/evaluate/evaluate.controller';
import { EvaluateService } from './service/evaluate/evaluate.service';

@Module({
  controllers: [EvaluateController],
  providers: [EvaluateService],
})
export class EvaluateModule {}
