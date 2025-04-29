import request from "supertest";  // Pour envoyer des requêtes HTTP à l'API
import app from '../index';  // Ton fichier d'application


let serveur;

beforeAll(async () => {
  // Assure-toi que la connexion à la 
  serveur = app.listen(5000, () => {  // Utilise un port fixe (par exemple 5000)
    console.log('Serveur lancé sur le port 5000');
  });
});

afterAll(async () => {
  // Ferme le serveur et la connexion à la base de données
  await serveur.close();
 
  console.log('Serveur arrêté et connexion à la base de données fermée');
});

describe('Test sendcode', () => {

  // Test pour vérifier la validation des données (données manquantes)
  test('should return 400 if validation fails', async () => {
    const res = await request(app)
      .post('/auth/sendcode')  // Assurez-vous que votre route est correcte
      .send({});  // Données invalides (vide)
    
    expect(res.status).toBe(400);  // Vérifie le statut 400 pour une validation échouée
    expect(res.body.msg).toBe('Erreur de validation des données.');  // Optionnel, selon ton message d'erreur
  });

  // Test pour vérifier si l'utilisateur est introuvable
  test('should return 404 if user is not found', async () => {
    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: 'nonexistent@exemple.com' });  // Email non existant
    
    expect(res.status).toBe(404);  // Vérifie que la réponse est 404
    expect(res.body.msg).toBe("Utilisateur non trouvé pour l'email : nonexistent@exemple.com");  // Assurez-vous d'avoir un message d'erreur cohérent
  });

  // Test pour vérifier que l'email est envoyé avec succès pour un utilisateur existant
  test('should return 200 and send verification email for valid user', async () => {
    const validEmail = 'saidnichan6@gmail.com';  // email exist deja dans la base de donnees 
    
    const res = await request(app)
      .post('/auth/sendcode')
      .send({ email: validEmail });
    
    expect(res.status).toBe(200); 
    
  });
});

