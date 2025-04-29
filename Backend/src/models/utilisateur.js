import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';     
class Utilisateur extends Model {
  static associate(models) {
    
    this.hasOne(models.Administrateur, { as: 'administrateur', foreignKey: 'cin' });
    this.hasOne(models.Etudiant,       { as: 'etudiant',       foreignKey: 'cin' });
    this.hasOne(models.Enseignant,     { as: 'enseignant',     foreignKey: 'cin' });
    this.hasOne(models.RefreshToken, { as: 'refreshToken', foreignKey: 'idUtilisateur' });
    this.hasOne(models.VerificationCode,{as:'verificationCode',foreignKey: 'idUtilisateur'});
    this.hasOne(models.Professionnel,  { as: 'professionnel',  foreignKey: 'cin' });
    this.belongsTo(models.Administrateur, {
      as: 'gerant',
      foreignKey: 'administrateurId'
    });
    this.hasMany(models.Evaluation, { as: 'evaluations', foreignKey: 'cinEvaluateur' });
  }
}

Utilisateur.init(
  {
    cin: {
      type: DataTypes.STRING(7),
      primaryKey: true
    },
    pwd:{type: DataTypes.STRING(255),
        allowNull: false},
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    role: {
      type: DataTypes.ENUM(
        'etudiant',
        'enseignant',
        'professionnel',
        'administrateur'
      ),
      allowNull: false
    },
    administrateurId: {
      type: DataTypes.STRING(7),
      allowNull: true           }
  },
  {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'utilisateurs',
    timestamps: false
  }
);

export default Utilisateur;