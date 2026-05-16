const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { User, Member, sequelize, initModels } = require('./models');
const { authMiddleware, SECRET_KEY } = require('./middleware/auth');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3207;

app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username, status: true } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ success: true, token, user: { username: user.username, role: user.role } });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Member Routes
app.get('/api/members', authMiddleware, async (req, res) => {
  try {
    const members = await Member.findAll({ order: [['createdAt', 'DESC']] });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members' });
  }
});

app.post('/api/members', authMiddleware, async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    await member.update(req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/members/:id', authMiddleware, async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    await member.destroy();
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User/Account Routes
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Dashboard Stats
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const totalMembers = await Member.count();
    const activeMembers = await Member.count({ where: { status: 'active' } });
    const totalBalance = await Member.sum('balance') || 0;
    const totalPoints = await Member.sum('points') || 0;
    
    // Recent activity (dummy for now, or just last 5 members)
    const recentMembers = await Member.findAll({ limit: 5, order: [['createdAt', 'DESC']] });

    res.json({
      totalMembers,
      activeMembers,
      totalBalance,
      totalPoints,
      recentMembers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Serve Frontend
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API not found' });
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
const start = async () => {
  try {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    await initModels();
    logger.info('Database connected');
    
    // Auto-seed if empty
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      logger.info('No admin found, running auto-seed...');
      // Note: In a real app we'd trigger the seed script properly
      await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    }

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
  }
};

start();
