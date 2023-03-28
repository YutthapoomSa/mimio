/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private readonly BUCKET_NAME = 'files';

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      port: Number(this.configService.get('MINIO_PORT')),
      useSSL: this.configService.get('MINIO_USE_SSL') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get('MINIO_SECRET_KEY'),
    });
  }

  async createBucketIfNotExists() {
    const bucketExists = await this.minioClient.bucketExists(this.BUCKET_NAME);
    if (bucketExists) {
      console.log(`Bucket ${this.BUCKET_NAME} already exists.`);
    } else {
      await this.minioClient.makeBucket(this.BUCKET_NAME, 'us-east-1');
      console.log(`Bucket ${this.BUCKET_NAME} created successfully.`);
    }
  }

  async uploadFile(file: Express.Multer.File) {
    const fileName = randomUUID() + '-' + file.originalname;
    await this.minioClient.putObject(
      this.BUCKET_NAME,
      fileName,
      file.buffer,
      file.size,
    );
    return fileName;
  }

  async getFileUrl(fileName: string) {
    return this.minioClient.presignedUrl('GET', this.BUCKET_NAME, fileName);
  }
}
