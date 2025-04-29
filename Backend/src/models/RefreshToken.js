import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class RefreshToken extends Model {
  static associate(models) {
    this.belongsTo(models.Utilisateur, {
      foreignKey: 'idUtilisateur', 
      targetKey: 'cin',            
      as: 'utilisateur'           
    });
  }
}

RefreshToken.init(
  {
    idtoken: {
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idUtilisateur: {
      type: DataTypes.STRING(7),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refreshToken',
    timestamps: false
  }
);

export default RefreshToken;