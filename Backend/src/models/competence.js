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
                onDelete:'CASCADE',
                onUpdate:'CASCADE'                
            },
        });
        this.hasMany(models.Evaluation,
        {
            as:'evaluations',
            foreignKey:'id_competence'
        })
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