import { Module } from '@nestjs/common';
import { RecoveryController } from './recovery.controller.js';
import { RecoveryService } from './recovery.service.js';

@Module({
  controllers: [RecoveryController],
  providers: [RecoveryService],
})
export class RecoveryModule {}