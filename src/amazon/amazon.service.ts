import { Injectable, StreamableFile } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class AmazonService {
  private readonly s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFile(
    file: any,
    bucketName: string,
    fileName: string
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params = {
      Body: file,
      Bucket: bucketName,
      Key: fileName,
    };

    return this.s3.upload(params).promise();
  }

  getObjectUrl(bucketName: string, fileName: string): string {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    return this.s3.getSignedUrl("getObject", params);
  }
}
