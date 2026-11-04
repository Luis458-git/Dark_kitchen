// ===============================================
//  Configuración de MySQL para Sequelize
//  Las credenciales se leen del archivo backend/.env
// ===============================================
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const baseConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  logging: false
};

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig, database: `${process.env.DB_NAME}_test` },
  production: { ...baseConfig }
};
