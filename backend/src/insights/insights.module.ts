import { Module } from '@nestjs/common';
import { InsightsController } from './insights.controller.js';
import { InsightsService } from './insights.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [InsightsController],
  imports: [AuthModule],
  providers: [InsightsService]
})
export class InsightsModule {}
