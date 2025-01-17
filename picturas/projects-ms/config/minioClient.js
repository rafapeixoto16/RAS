import {Client} from 'minio';

const minioClient = new Client({
    endPoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
});

const lifecycleConfig = {
    Rule: [{
        ID: 'DeleteAfter2Days',
        Status: 'Enabled',
        Expiration: { Minutes: 2 },
        Filter: {
            Prefix: ''
        }
    }]
};

export async function setupBucket() {
    const exists = await minioClient.bucketExists(process.env.S3_PICTURE_BUCKET);

    if (!exists) {
        await minioClient.makeBucket(process.env.S3_PICTURE_BUCKET);
        await minioClient.makeBucket(process.env.S3_TEMP_BUCKET);
        await minioClient.setBucketLifecycle(process.env.S3_TEMP_BUCKET, lifecycleConfig);
    }
}

export function rewriteS3Url(url) {
    return url.replace("http://minio:9000", process.env.FRONTEND_URL + '/s3');
}

export default minioClient;
