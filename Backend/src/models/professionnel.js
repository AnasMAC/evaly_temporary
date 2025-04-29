import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class Professionnel extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      as: 'base',
      foreignKey: 'cin'
    });
    this.hasMany(models.Cadre, {
      as: 'encadrant',
      foreignKey: 'cin'
    });
  }
}

Professionnel.init(
  {
    cin: {
      type: DataTypes.STRING(7),
      primaryKey: true
    },
    nomEntreprise:  DataTypes.STRING(100),
    domaineActivite: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Professionnel',
    tableName: 'professionnels',
    timestamps: false
  }
);

export default Professionnel;
