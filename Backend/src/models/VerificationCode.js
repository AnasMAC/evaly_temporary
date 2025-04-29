import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class VerificationCode extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur',
      targetKey: 'cin',
    });
  }
}

VerificationCode.init(
  {
    idUtilisateur: {
      type: DataTypes.STRING(7),
      allowNull: false,  // Mise à jour pour ne pas permettre la valeur NULL
    },
    idVerification: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'VerificationCode',
    tableName: 'verificationCode',
    timestamps: false,
  }
);

export default VerificationCode;
