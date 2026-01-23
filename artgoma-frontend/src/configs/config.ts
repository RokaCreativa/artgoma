const db = process.env.DATABASE_URL;

const minio = {
  endpoint: process.env.MINIO_ENDPOINT as string,
  bucketName: process.env.MINIO_BUCKET_NAME as string,
  accessKeyId: process.env.MINIO_KEY as string,
  secretAccessKey: process.env.MINIO_SECRET_KEY as string,
};

const appConfig = {
  minio,
  db,
};

export default appConfig;
