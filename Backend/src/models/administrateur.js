import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class Administrateur extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      as: 'base',
      foreignKey: 'cin'
    });

    this.hasMany(models.Utilisateur, {
      as: 'usersGeres',
      foreignKey: 'administrateurId'
    });
  }
}

Administrateur.init(
  {
    cin: {
      type: DataTypes.STRING(7),
      primaryKey: true
    }
  },
  {
    sequelize,
    modelName: 'Administrateur',
    tableName: 'administrateurs',
    timestamps: false
  }
);

export default Administrateur;
