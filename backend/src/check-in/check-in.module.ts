import { Module } from '@nestjs/common';
import { CheckInController } from './check-in.controller.js';
import { CheckInService } from './check-in.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [CheckInController],
  imports: [AuthModule],
  providers: [CheckInService]
})
export class CheckInModule {}
