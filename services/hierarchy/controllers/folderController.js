import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Create a new folder
export const createFolder = async (req, res) => {
    try {
        const { name, parentId } = req.body;
        const userId = req.user?.userId;

        if (!userId) return res.status(400).json({ error: 'User ID is required.' });
        if (!name) return res.status(400).json({ error: 'Folder name is required.' });

        // If parentId is provided, validate it
        if (parentId) {
            const parent = await prisma.folder.findUnique({ where: { id: parentId } });
            if (!parent) return res.status(400).json({ error: 'Invalid parentId: Parent folder not found.' });
        }

        const folder = await prisma.folder.create({
            data: {
                name,
                userId,
                parentId: parentId || null,
                createdAt: new Date()
            }
        });

        res.status(201).json(folder);
    } catch (err) {
        console.error('Create Folder Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

// Get all root-level folders for the logged-in user
export const getRootFolders = async (req, res) => {
    const userId = req.user?.userId;

    try {
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const folders = await prisma.folder.findMany({
            where: {
                userId,
                parentId: null,
            },
        });

        res.status(200).json(folders);
    } catch (err) {
        console.error('Get Root Folders Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

// Get the content of a folder (subfolders + documents)
export const getFolderContent = async (req, res) => {
    const { folderId } = req.params;
    const userId = req.user?.userId;

    try {
        const folder = await prisma.folder.findUnique({
            where: { id: folderId },
            include: {
                children: true,
                documents: true,
            },
        });

        if (!folder || folder.userId !== userId) {
            return res.status(404).json({ error: 'Folder not found or access denied.' });
        }

        res.status(200).json(folder);
    } catch (err) {
        console.error('Get Folder Content Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

// Update folder name
export const updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user?.userId;

    try {
        const folder = await prisma.folder.findUnique({ where: { id } });
        if (!folder || folder.userId !== userId) {
            return res.status(404).json({ error: 'Folder not found or access denied.' });
        }

        const updated = await prisma.folder.update({
            where: { id },
            data: { name },
        });

        res.status(200).json(updated);
    } catch (err) {
        console.error('Update Folder Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};

// Delete folder
export const deleteFolder = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const folder = await prisma.folder.findUnique({ where: { id } });
        if (!folder || folder.userId !== userId) {
            return res.status(404).json({ error: 'Folder not found or access denied.' });
        }

        await prisma.folder.delete({ where: { id } });

        res.json({ message: 'Folder deleted successfully.' });
    } catch (err) {
        console.error('Delete Folder Error:', err);
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};
