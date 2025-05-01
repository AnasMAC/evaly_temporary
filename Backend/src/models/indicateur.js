import { Model, DataTypes } from 'sequelize';
import sequelize from './db.js';

class Indicateur extends Model {
    static associate(models) {
        this.belongsTo(models.Cadre, {
        foreignKey: 'id_cadre',
        as: 'cadre'
        });
    }   
}

Indicateur.init(
    {
        id_indicateur: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        indicateur:{
            type: DataTypes.STRING(50),
            allowNull: false
        },
        
    },
    {
        sequelize,
        modelName: 'Indicateur',
        tableName: 'indicateurs',
        timestamps: false
    }
);

export default Indicateur;