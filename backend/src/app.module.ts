import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { CheckInModule } from './check-in/check-in.module.js';
import { InsightsModule } from './insights/insights.module.js';
import { DatabaseModule } from './database/database.module.js';
import { RecoveryModule } from './recovery/recovery.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    CheckInModule,
    InsightsModule,
    RecoveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
