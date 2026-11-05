'use strict';
const { Model } = require('sequelize');

// Expresión regular para horas en formato HH:MM o HH:MM:SS (00:00 a 23:59:59)
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

module.exports = (sequelize, DataTypes) => {
  class MarcaVirtual extends Model {
    static associate(models) {
      MarcaVirtual.hasMany(models.Platillo, {
        foreignKey: 'marca_id',
        as: 'platillos',
        onDelete: 'RESTRICT'
      });
      MarcaVirtual.hasMany(models.Pedido, {
        foreignKey: 'marca_id',
        as: 'pedidos',
        onDelete: 'RESTRICT'
      });
    }
  }

  MarcaVirtual.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: 'El nombre es obligatorio' },
          notEmpty: { msg: 'El nombre no puede estar vacío' },
          len: { args: [1, 100], msg: 'El nombre debe tener máximo 100 caracteres' }
        }
      },
      tipo_cocina: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: { msg: 'El tipo de cocina es obligatorio' },
          notEmpty: { msg: 'El tipo de cocina no puede estar vacío' },
          len: { args: [1, 50], msg: 'El tipo de cocina debe tener máximo 50 caracteres' }
        }
      },
      horario_apertura: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: 'El horario de apertura es obligatorio' },
          is: { args: TIME_REGEX, msg: 'El horario de apertura debe tener formato HH:MM o HH:MM:SS' }
        }
      },
      horario_cierre: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: { msg: 'El horario de cierre es obligatorio' },
          is: { args: TIME_REGEX, msg: 'El horario de cierre debe tener formato HH:MM o HH:MM:SS' }
        }
      },
      activo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'MarcaVirtual',
      tableName: 'marcas_virtuales',
      timestamps: true
    }
  );

  return MarcaVirtual;
};
