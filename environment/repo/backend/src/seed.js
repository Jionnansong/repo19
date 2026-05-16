const { User, Member, sequelize } = require('./models');
const logger = require('./utils/logger');

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    logger.info('Database synchronized');

    // Create Admin
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'admin'
    });
    logger.info('Admin user created');

    // Create some members
    const members = [
      { name: 'John Doe', phone: '13800138000', level: 'Gold', balance: 500.00, points: 1000 },
      { name: 'Jane Smith', phone: '13900139000', level: 'Silver', balance: 200.00, points: 450 },
      { name: 'Alice Wong', phone: '13700137000', level: 'Normal', balance: 50.00, points: 120 },
      { name: 'Bob Lee', phone: '13600136000', level: 'Platinum', balance: 1200.00, points: 3000 }
    ];

    await Member.bulkCreate(members);
    logger.info('Seed members created');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
