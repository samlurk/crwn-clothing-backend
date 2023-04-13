import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RequestService } from './providers/request/request';
import { ConfigAppModule } from './config/config.module';

@Module({
  imports: [ConfigAppModule, UserModule],
  controllers: [AppController],
  providers: [AppService, RequestService]
})
export class AppModule {}
