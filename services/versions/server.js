// server.js
import express from 'express';
import versionRoutes from './routes/versionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5003;

app.use(express.json());


app.use('/api', versionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
