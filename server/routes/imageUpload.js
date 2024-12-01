import e from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imageUploadController.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = e.Router();

router.post('/upload', upload.single('image'), uploadImage);

export default router;