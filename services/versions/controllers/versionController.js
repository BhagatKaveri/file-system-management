import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const generateFileUrl = (filename) => `https://storage.example.com/${filename}`;

export const getDocument = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        if (document.userId !== userId) {
            return res.status(403).json({ error: 'Access forbidden' });
        }

        res.json(document);
    } catch (err) {
        res.status(500).json({ error: 'Something went wrong', details: err.message });
    }
};




export const createDocument = async (req, res) => {
    const userId = req.user.userId;

    const { title, content, folder } = req.body;
    const file = req.file;

    try {
        const document = await prisma.document.create({
            data: {
                title,
                content,
                folderId: folder,
                userId,
                createdAt: new Date(),
            },
        });

        res.status(201).json({ message: 'Document created', document });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create document', details: error.message });
    }
};



export const createVersion = async (req, res) => {
    const { id } = req.params;
    const { versionNumber } = req.body;
    const userId = req.user.userId;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'File is required for versioning.' });

    try {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document || document.userId !== userId) {
            return res.status(404).json({ error: 'Document not found or access denied.' });
        }

        const versionsPath = `versions/${id}.json`;
        const existingVersions = fs.existsSync(versionsPath)
            ? JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
            : [];

        const fileUrl = generateFileUrl(file.filename);
        const newVersion = {
            version: versionNumber,
            fileUrl,
            uploadedAt: new Date().toISOString(),
        };

        existingVersions.push(newVersion);
        fs.writeFileSync(versionsPath, JSON.stringify(existingVersions, null, 2));

        res.status(201).json(newVersion);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create version', details: err.message });
    }
};


export const getVersions = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document || document.userId !== userId) {
            return res.status(404).json({ error: 'Document not found or access denied.' });
        }

        const versionsPath = `versions/${id}.json`;
        const versions = fs.existsSync(versionsPath)
            ? JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
            : [];

        res.json(versions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch versions', details: err.message });
    }
};


export const updateDocument = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.userId;

    try {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document || document.userId !== userId) {
            return res.status(404).json({ error: 'Document not found or access denied.' });
        }

        const updated = await prisma.document.update({
            where: { id },
            data: { title, content },
        });

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Update failed', details: err.message });
    }
};


export const deleteDocument = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const document = await prisma.document.findUnique({ where: { id } });

        if (!document || document.userId !== userId) {
            return res.status(404).json({ error: 'Document not found or access denied.' });
        }

        await prisma.document.delete({ where: { id } });

        const versionsPath = `versions/${id}.json`;
        if (fs.existsSync(versionsPath)) fs.unlinkSync(versionsPath);

        res.json({ message: 'Document and all versions deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Delete failed', details: err.message });
    }
};



async function buildFolderPath(folderId) {
    const folder = await prisma.folder.findUnique({
        where: { id: folderId },
        include: { parent: true }
    });
    if (!folder) return '';
    const parentPath = folder.parent ? await buildFolderPath(folder.parent.id) : '';
    return `${parentPath}${parentPath ? '/' : ''}${folder.name}`;
}

export const filterDocuments = async (req, res) => {
    const { search } = req.query;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(403).json({ error: 'Forbidden: User not authenticated' });
    }

    try {
        const docs = await prisma.document.findMany({
            where: {
                userId,
                OR: [
                    { title: { contains: search || '', mode: 'insensitive' } },
                    { content: { contains: search || '', mode: 'insensitive' } },
                ],
            }
        });

        const response = await Promise.all(
            docs.map(async (doc) => ({
                id: doc.id,
                title: doc.title,
                folderPath: await buildFolderPath(doc.folderId),
            }))
        );

        res.json(response);
    } catch (err) {
        console.error('Filter Error:', err);
        res.status(500).json({ error: 'Failed to filter documents', details: err.message });
    }
};


export const getTotalDocumentCount = async (req, res) => {
    const userId = req.user.userId;

    try {
        const count = await prisma.document.count({
            where: { userId },
        });

        res.json({ totalDocuments: count });
    } catch (err) {
        console.error('Error in /total-documents:', err);
        res.status(500).json({ error: 'Failed to get document count', details: err.message });
    }
};

