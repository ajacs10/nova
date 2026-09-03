import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RecoveryController } from './recovery.controller.js';
import { RecoveryService } from './recovery.service.js';

@Module({
  controllers: [RecoveryController],
  imports: [AuthModule],
  providers: [RecoveryService],
})
export class RecoveryModule {}
