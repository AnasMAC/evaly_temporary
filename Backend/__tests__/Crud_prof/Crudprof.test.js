import { describe, it, beforeAll, beforeEach, afterEach, afterAll, expect } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';

import app from '../../index.js';                 
import db from '../../src/models/index.js'; 



describe('API test  enseignant CRUD',()=>{
    beforeAll(async()=>{
     await db.sequelize.sync({force : true});
    }) 
    let idadmin;
    const ensignantCin='AB0000';
    beforeEach(async()=>{
        const hashedAdminPwd = await bcrypt.hash('admin00', 10); 
            const admin = await db.Utilisateur.create({
              cin : 'KB2001',
              pwd : hashedAdminPwd,
              nom: 'nichan',
              prenom : 'said',
              email : 'saidnichan@gmail.com',
              role : 'administrateur'
            });
             await db.Administrateur.create({
                  cin: admin.cin 
                });
            idadmin=admin.cin;

            await db.Utilisateur.create({
                cin: ensignantCin,
                pwd: hashedAdminPwd,
                nom: 'mohamed',
                prenom: 'ghilani',
                email: 'mohamedghilani@gmail.com',
                role: 'enseignant',
                administrateurId: admin.cin
              });
          
              await db.Enseignant.create({
                cin: ensignantCin,
                departement: 'Informatique',
               
              });
            });
    
    afterEach(async () => {
        await db.sequelize.truncate({ cascade: true });
      });
     afterAll(async () => {
        await db.sequelize.close();
      });




    it('Create enseignant test return 201 ',async()=>{
        const res= await request(app).post(`/api/enseignants/${idadmin}`).send({
            cin:"AB1022",
            nom:"fisssone",
            prenom:"rachida",
            email:"rachida@gmail.com",
            role:"enseignant",
            departement:"Informatique",
            
        })
        console.log(res.body)
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Enseignant créé avec succès');
      
    })
    // update etudiant 
    
    it('should update enseignant details successfully', async () => {
        const res = await request(app)
          .put(`/api/enseignants/${idadmin}`)
          .send({
            cin: ensignantCin,
            nom: "mohamed",
            prenom: "nichan",
            email: "mohamed@gmail.com",
            role: "etudiant",
            departement:"physique"
          });
    
        
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Enseignant mis à jour avec succès');
        }) 
        // deleete user 
        it('should be delete enseignant  successfully && return 200', async () => {
            const res = await request(app)
              .delete(`/api/enseignants/${idadmin}/${ensignantCin}`);
        
            
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Enseignant supprimé avec succès');
            const deletedEtudiant = await db.Enseignant.findOne({ where: { cin: ensignantCin } });
            const deletedUtilisateur = await db.Utilisateur.findOne({ where: { cin: ensignantCin } });

 
            expect(deletedEtudiant).toBeNull();
            expect(deletedUtilisateur).toBeNull();

            }) 
            it('should be delete enseignant  successfully && return 200', async () => {
                const res = await request(app)
                  .delete(`/api/enseignants/${idadmin}/NoCin`).send();
                expect(res.status).toBe(404);
                expect(res.body.message).toBe("Enseignant non trouvé");
               
                }) 
                it('should return all enseignant with their details', async () => {
                    const res = await request(app)
                      .get(`/api/enseignants/${idadmin}`)
                      .send();
                
                    expect(res.status).toBe(200);
                    expect(res.body).toBeInstanceOf(Array);
                    expect(res.body[0]).toHaveProperty('cin');
                    expect(res.body[0]).toHaveProperty('nom');
                    expect(res.body[0]).toHaveProperty('prenom');
                    expect(res.body[0]).toHaveProperty('email');
                    expect(res.body[0]).toHaveProperty('enseignant');
                    expect(res.body[0].enseignant).toHaveProperty('departement');
                  }); 
                
      
})