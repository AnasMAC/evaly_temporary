import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from './db.js';

class Competence extends Model{
    static associate(models){
        this.belongsToMany(models.Cadre,
        {
            through:"referenteil",
            as:'competences',
            foreignKey:{
                name:'id_Competence',              
            },
        });
        this.hasMany(models.Evaluation,
        {
            as:'evaluations',
            foreignKey:'id_competence'
        })
        this.hasMany(models.Indicateur, {
            as: 'indicateurs',
            foreignKey: 'id_competence',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }
}

Competence.init(
    {
        id_Competence:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nom:{
            type:DataTypes.STRING,
            allowNull: false
        },
        Categorie:{
            type:DataTypes.STRING,
            allowNull: false
        },
        Descreption:{
            type:DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName:'Competence',
        tableName:'competences',
        timestamps:true
    }
)

export default Competence;