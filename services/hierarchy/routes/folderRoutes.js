import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
    createFolder,
    getRootFolders,
    getFolderContent,
    updateFolder,
    deleteFolder,
} from '../controllers/folderController.js';

const router = express.Router();

router.get('/viewstore', authenticate, getRootFolders);
router.get('/viewstore/:folderId', authenticate, getFolderContent);
router.post('/folders', authenticate, createFolder);
router.put('/folders/:id', authenticate, updateFolder);
router.delete('/folders/:id', authenticate, deleteFolder);

export default router;
