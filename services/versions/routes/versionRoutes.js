import express from 'express';
import multer from 'multer';
import {
    createDocument,
    getDocument,
    createVersion,
    getVersions,
    updateDocument,
    deleteDocument,
    filterDocuments,
    getTotalDocumentCount
} from '../controllers/versionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/documents', authenticate, upload.single('file'), createDocument);
router.get('/documents/:id', authenticate, getDocument);
router.post('/documents/:id/version', authenticate, upload.single('file'), createVersion);
router.get('/documents/:id/versions', authenticate, getVersions);
router.put('/documents/:id', authenticate, updateDocument);
router.delete('/documents/:id', authenticate, deleteDocument);
router.get('/filter', authenticate, filterDocuments);
router.get('/total-documents', authenticate, getTotalDocumentCount);

export default router;
