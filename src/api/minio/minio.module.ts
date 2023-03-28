import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioController } from './minio.controller';

@Module({
  imports: [],
  controllers: [MinioController],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class MinioModule {}
