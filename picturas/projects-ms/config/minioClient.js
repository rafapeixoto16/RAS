import {Client} from 'minio';

const minioClient = new Client({
    endPoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
});

export async function setupBucket() {
    const exists = await minioClient.bucketExists(process.env.S3_PICTURE_BUCKET);

    if (!exists) {
        await minioClient.makeBucket(process.env.S3_PICTURE_BUCKET);
    }
}

export default minioClient;
