'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    static associate(models) {
      Pedido.belongsTo(models.MarcaVirtual, {
        foreignKey: 'marca_id',
        as: 'marca'
      });
    }
  }

  Pedido.init(
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
      numero_orden: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: {
          msg: 'El número de orden ya existe'
        },
        validate: {
          notNull: { msg: 'El número de orden es obligatorio' },
          notEmpty: { msg: 'El número de orden no puede estar vacío' }
        }
      },
      plataforma: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: { msg: 'La plataforma es obligatoria' },
          notEmpty: { msg: 'La plataforma no puede estar vacía' }
        }
      },
      cliente_nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: { msg: 'El nombre del cliente es obligatorio' },
          notEmpty: { msg: 'El nombre del cliente no puede estar vacío' }
        }
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          notNull: { msg: 'El total es obligatorio' },
          isDecimal: { msg: 'El total debe ser un número decimal válido' },
          min: { args: [0], msg: 'El total no puede ser negativo' }
        }
      },
      estado: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'recibido',
        validate: {
          isIn: {
            args: [['recibido', 'en_preparacion', 'listo_para_despacho', 'entregado', 'cancelado']],
            msg: 'Estado no válido'
          }
        }
      },
      fecha_pedido: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      notas_entrega: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'Pedido',
      tableName: 'pedidos',
      timestamps: true
    }
  );

  return Pedido;
};
