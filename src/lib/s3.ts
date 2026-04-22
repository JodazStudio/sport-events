import { S3Client } from "@aws-sdk/client-s3";
import { env } from './env';

export const s3Client = new S3Client({
  region: 'global',  // Can be anything
  endpoint: env.MEGA_S4_ENDPOINT!,
  credentials: {
    accessKeyId: env.MEGA_S4_ACCESS_KEY!,
    secretAccessKey: env.MEGA_S4_SECRET_KEY!,
  },
  forcePathStyle: true,  // Important for MEGA S4!
});