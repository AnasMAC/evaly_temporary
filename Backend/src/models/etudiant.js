// models/etudiant.js
import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class Etudiant extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      as: 'base',            
      foreignKey: 'cin'
    });
    this.belongsToMany(models.Cadre, {
      through: 'etudiant_cadre',
      as: 'participants',
      foreignKey: 'cinEtudiant'
    });
    this.hasMany(models.Evaluation, {
      as: 'evaluations',
      foreignKey: 'cinEvalué'
    });
  }
}

Etudiant.init(
  {
    cin: {
      type: DataTypes.STRING(7),
      primaryKey: true
    },
    promotion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    filiere: {
      type: DataTypes.STRING(50)
    }
  },
  {
    sequelize,
    modelName: 'Etudiant',
    tableName: 'etudiants',
    timestamps: false
  }
);

export default Etudiant;
