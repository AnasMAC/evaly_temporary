import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../index.js';                 
import db from '../../src/models/index.js'; 


describe('API test student CRUD',()=>{
    beforeAll(async()=>{

    await db.sequelize.sync({force : true});
     
    }) 
    let idadmin;
    const etudiantCin = 'AB1234';
    beforeEach(async () =>{
        const hashedAdminPwd = await bcrypt.hash('admin1234', 10); 
            const admin = await db.Utilisateur.create({
              cin : 'KB2007',
              pwd : hashedAdminPwd,
              nom: 'nichan',
              prenom : 'said',
              email : 'saidnichan540@gmail.com',
              role : 'administrateur'
            });
             await db.Administrateur.create({
                  cin: admin.cin 
                });
            idadmin = admin.cin;

            await db.Utilisateur.create({
                cin: etudiantCin,
                pwd: hashedAdminPwd,
                nom: 'lahcen',
                prenom: 'zaki',
                email: 'lahcen@gmail.com',
                role: 'etudiant',
                administrateurId: admin.cin
              });
          
              await db.Etudiant.create({
                cin: etudiantCin,
                promotion: '2025',
                filiere: 'GINF1'
              });
            });
    
    afterEach(async () => {
        await db.sequelize.truncate({ cascade: true });
      });
     afterAll(async () => {
        await db.sequelize.close();
      });




    it('Create student test return 201 ',async()=>{
        const res= await request(app).post(`/api/etudiants/${idadmin}`).send({
            cin:"AB1022",
            nom:"said1",
            prenom:"nichan5",
            email:"said123@gmail.com",
            role:"etudiant",
            promotion:"2026",
            filiere:"GINF1"
        })
        console.log(res.body)
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Etudiant créé avec succès');
      
    })

    // update etudiant 
    
    it('should update student details successfully', async () => {
        const res = await request(app)
          .put(`/api/etudiants/${idadmin}`)
          .send({
            cin: etudiantCin,
            nom: "mohamed",
            prenom: "nichan",
            email: "mohamed@gmail.com",
            role: "etudiant",
            promotion: "2026",
            filiere: "GINF2"
          });
    
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Étudiant mis à jour avec succès');
        }) 
        // deleete user 
        it('should be delete student  successfully && return 200', async () => {
            const res = await request(app)
              .delete(`/api/etudiants/${idadmin}/${etudiantCin}`);
        
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Étudiant supprimé avec succès');
            const deletedEtudiant = await db.Etudiant.findOne({ where: { cin: etudiantCin } });
            const deletedUtilisateur = await db.Utilisateur.findOne({ where: { cin: etudiantCin } });

 
            expect(deletedEtudiant).toBeNull();
            expect(deletedUtilisateur).toBeNull();

            }) 
            it('should be delete student  successfully && return 200', async () => {
                const res = await request(app)
                  .delete(`/api/etudiants/${idadmin}/NoCin`).send();
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("Étudiant non trouvé");
               
                }) 
                it('should return all students with their details', async () => {
                    const res = await request(app)
                      .get(`/api/etudiants/${idadmin}`)
                      .send();
                
                    expect(res.status).toBe(200);
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body[0]).toHaveProperty('cin');
                    expect(res.body[0]).toHaveProperty('nom');
                    expect(res.body[0]).toHaveProperty('prenom');
                    expect(res.body[0]).toHaveProperty('email');
                    expect(res.body[0]).toHaveProperty('etudiant');
                    expect(res.body[0].etudiant).toHaveProperty('filiere');
                    expect(res.body[0].etudiant).toHaveProperty('promotion');
                  });   
      
})