import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes';
import authRoutes from './routes/authRoutes';
import toolsRoutes from './routes/toolsRoutes';
import automationsRoutes from './routes/automationsRoutes';
import activityRoutes from './routes/activityRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/agent', agentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolsRoutes);
app.use('/api/automations', automationsRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'ActionOS API Server',
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`⚡ ActionOS Server listening on http://localhost:${PORT}`);
});
