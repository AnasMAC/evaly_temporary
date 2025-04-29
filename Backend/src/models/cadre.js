import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from './db.js';

class Cadre extends Model {
    static associate(models) {
        this.belongsToMany(models.Etudiant, {
            through: 'etudiant_cadre',
            as: 'participants',
            foreignKey: {
                name: 'id_cadre',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        });
        this.belongsTo(models.Professionnel),
        this.belongsToMany(models.Enseignant, {
            through: 'enseignant_cadre',
            as: 'superviseurs',
            foreignKey: {
                name: 'id_cadre',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        });
        this.belongsToMany(models.Competence, {
            through: 'referenteil',
            as: 'competences',
            foreignKey: {
                name: 'id_cadre',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
        });
        this.hasMany(models.Evaluation, {
            as: 'evaluations',
            foreignKey: 'id_cadre'
        });
    }
}

Cadre.init(
    {
        id_cadre: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nom:{
            type: DataTypes.STRING(50),
            allowNull: false
        },
        Type:{
            type: DataTypes.STRING(50)
        },
        Frequence_evaluation:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Date_debut:{
            type: DataTypes.DATE,
            allowNull: false
        },
        Date_fin:{
            type: DataTypes.DATE,
            allowNull: false
        },
        Description:{
            type: DataTypes.STRING(500),
            allowNull: false
        }
    },{ 
        sequelize,
        modelName: 'Cadre',
        tableName: 'cadres',
        timestamps: true
    }
);

export default Cadre;