const express = require('express');
require('dotenv').config();
const sequelize = require('./config/database');
const Survey = require('./models/Survey');
const surveyRoutes = require('./routes/surveyRoutes');
const ifcRoutes = require('./routes/IfcRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use(express.json());
app.use('/api/surveys', surveyRoutes);
app.use('/api/ifc', ifcRoutes);

// Sync DB and start server
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
