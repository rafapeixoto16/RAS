import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 30000000 } });

export default upload;
