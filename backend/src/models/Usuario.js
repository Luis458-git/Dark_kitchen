'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      // Entidad transversal de acceso
    }
  }

  Usuario.init(
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
          notEmpty: { msg: 'El nombre no puede estar vacío' }
        }
      },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: {
          msg: 'El correo electrónico ya está registrado'
        },
        validate: {
          notNull: { msg: 'El correo es obligatorio' },
          isEmail: { msg: 'El formato de correo no es válido' }
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notNull: { msg: 'La contraseña es obligatoria' },
          notEmpty: { msg: 'La contraseña no puede estar vacía' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      timestamps: true
    }
  );

  return Usuario;
};
