const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const folderRoutes = require('./routes/folderRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', folderRoutes);
app.use('/api', documentRoutes);

module.exports = app;
