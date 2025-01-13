import multer from 'multer';
import path from 'node:path';

const storage = multer.memoryStorage();

const upload = multer({
    fileFilter: function (req, file, cb) {
        const extension = path.extname(file.originalname).toLowerCase();
        const mimetype = file.mimetype;
        if (
            extension !== '.png' || mimetype !== 'image/png' ||
            extension !== '.jpg' || mimetype !== 'image/jpg' ||
            extension !== '.jpeg' || mimetype !== 'image/jpeg' ||
            extension !== '.bmp' || mimetype !== 'image/bmp' ||
            extension !== '.webp' || mimetype !== 'image/webp' ||
            extension !== '.tiff' || mimetype !== 'image/tiff'
        ) {
            cb('Invalid format, only png, jpg, jpeg, bmp webp and tiff are accepted', false);
        } else {
            cb(null, true);
        }
    },
    storage,
    limits: { fileSize: 10000000 }
});

export default upload;
