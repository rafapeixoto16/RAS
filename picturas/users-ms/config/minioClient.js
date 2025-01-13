import {Client} from 'minio';

const minioClient = new Client({
    endPoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
});

const policy = {
    Version: '2012-10-17',
    Statement: [
        {
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: [`arn:aws:s3:::${process.env.S3_PROFILE_PICTURE_BUCKET}/*`],
        },
    ],
};

export async function setupBucket() {
    const exists = await minioClient.bucketExists(process.env.S3_PROFILE_PICTURE_BUCKET);

    if (!exists) {
        await minioClient.makeBucket(process.env.S3_PROFILE_PICTURE_BUCKET);
        await minioClient.setBucketPolicy(process.env.S3_PROFILE_PICTURE_BUCKET, JSON.stringify(policy));
    }
}

export default minioClient;
