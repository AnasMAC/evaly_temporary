import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from './db.js';

class Evaluation extends Model {
    static associate(models) {
        this.belongsTo(models.Utilisateur, {
        as: 'evaluateur',
        foreignKey: 'cinEvaluateur'
        });
        this.belongsTo(models.Etudiant, {
        as: 'evalué',
        foreignKey: 'cinEvalué'
        });
        this.belongsTo(models.Cadre, {
        as: 'cadre',
        foreignKey: 'id_cadre'
        });
        this.belongsTo(models.Competence, {
        as: 'competence',
        foreignKey: 'id_competence'
        });
    }
}

Evaluation.init(
    {
        id_evaluation: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Date:{
            type: DataTypes.DATE,
            allowNull: false
        },
        Score:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        Commentaire:{
            type: DataTypes.STRING,
            allowNull: true
        },
        Anonymat:{
            type: DataTypes.ENUM(
                'ANONYME',
                'PARTIELMENT ANONYME',
                'NON ANONYME'
            ),
            allowNull: false
        },
    },
    {
        sequelize,
        modelName:'Evaluation',
        tableName:'evaluations',
        timestamps:true
    }
)

export default Evaluation;