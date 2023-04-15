import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RequestService } from './providers/request/request';
import { ConfigAppModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ConfigAppModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, RequestService]
})
export class AppModule {}
