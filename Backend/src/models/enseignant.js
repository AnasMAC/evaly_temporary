import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class Enseignant extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      as: 'base',
      foreignKey: 'cin'
    }),
    this.belongsToMany(models.Cadre, {
      through: 'enseignant_cadre',
      as: 'superviseurs',
      foreignKey: {
        name:'id_enseignant',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'},
    })
  }
}

Enseignant.init(
  {
    cin: {
      type: DataTypes.STRING(7),
      primaryKey: true
    },
    departement: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Enseignant',
    tableName: 'enseignants',
    timestamps: false
  }
);

export default Enseignant;
