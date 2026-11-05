'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Platillo extends Model {
    static associate(models) {
      Platillo.belongsTo(models.MarcaVirtual, {
        foreignKey: 'marca_id',
        as: 'marca'
      });
    }
  }

  Platillo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      marca_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: 'El id de la marca es obligatorio' },
          isInt: { msg: 'El id de la marca debe ser un número entero' }
        }
      },
      nombre: {
        type: DataTypes.STRING(120),
        allowNull: false,
        validate: {
          notNull: { msg: 'El nombre del platillo es obligatorio' },
          notEmpty: { msg: 'El nombre del platillo no puede estar vacío' },
          len: { args: [1, 120], msg: 'El nombre debe tener máximo 120 caracteres' }
        }
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: 'El precio es obligatorio' },
          isDecimal: { msg: 'El precio debe ser un número decimal válido' },
          min: { args: [0.01], msg: 'El precio debe ser mayor a 0' }
        }
      },
      categoria: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: { msg: 'La categoría es obligatoria' },
          notEmpty: { msg: 'La categoría no puede estar vacía' }
        }
      },
      tiempo_preparacion_min: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 15,
        validate: {
          isInt: { msg: 'El tiempo de preparación debe ser un entero' },
          min: { args: [1], msg: 'El tiempo de preparación mínimo es 1 minuto' }
        }
      },
      disponible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Platillo',
      tableName: 'platillos',
      timestamps: true
    }
  );

  return Platillo;
};
