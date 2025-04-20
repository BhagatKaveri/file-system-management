import express from 'express';
import dotenv from 'dotenv';
import folderRoutes from './routes/folderRoutes.js';
import documentRoutes from './routes/documentRoutes.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api', folderRoutes);
app.use('/api', documentRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Hierarchy service running on port ${PORT}`);
});
