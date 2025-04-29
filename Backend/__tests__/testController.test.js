 // Ton fichier d'application

 import request from "supertest";  // Pour envoyer des requêtes HTTP à l'API
 import app from "../index";  // Ton fichier d'application
 import bcrypt from "bcrypt";  // Mock de bcrypt
 import { generateAccessToken, generateRefreshToken } from "../src/assets/tokens";  // Mock de ces fonctions
 import { UtilisateurMock } from "../mock";

let serveur;


beforeEach(() => {
  serveur = app.listen(0, () => {
    const port = serveur.address().port;
    console.log(`Server is listening on port ${port}`);
  });
});


afterAll((done) => {
  serveur.close(done);
  console.log('Serveur arrêté');
});


describe('Test connexion API Authentification', () => {


  test('should return 200 && generate access token and refresh token for valid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'saidnichan6@gmail.com',
        pwd: 'Said1234@',  
      });
    console.log(res.body)
    // Vérifier que la réponse a le bon statut et que les tokens sont générés
    expect(res.status).toBe(200);
    expect(res.body.msg).toBe('Connexion réussie'); 
    expect(res.headers['set-cookie']).toBeDefined(); // Assure-toi que cette partie est bien présente dans ton code de réponse

   
  });
  test('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'saidnichan6@gmail.com',
        pwd: 'wrongpassword',  // Mot de passe incorrect
      });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Email ou mot de passe incorrect!');
  });

  test('should return 401 for non-existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nonexistent@exemple.com',  // Utilisateur non existant
        pwd: 'Said1234@',  // Mot de passe correct mais pour un utilisateur inexistant
      });

    expect(res.status).toBe(401);
    expect(res.body.msg).toBe('Email ou mot de passe incorrect!');
  });
  test('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        pwd: 'Said1234@',  // Mot de passe correct, mais sans email
      });

    expect(res.status).toBe(400);  // Vérifie que la réponse est 400
    expect(res.body.msg).toBe('Email et mot de passe sont requis!');  // Vérifie que le message d'erreur est correct
  });

  test('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'saidnichan6@gmail.com',  // Email correct, mais sans mot de passe
      });

    expect(res.status).toBe(400);  // Vérifie que la réponse est 400
    expect(res.body.msg).toBe('Email et mot de passe sont requis!');  // Vérifie que le message d'erreur est correct
  });
}); 
 // Mock de ces fonctions

  // Importer le modèle mocké
 
 // Mock des dépendances
/*  jest.mock("bcrypt");
 jest.mock("../src/assets/tokens");
 
 describe("Test login controller with Sequelize Mock", () => {
   
   it("should return 400 if email or password is missing", async () => {
     const res = await request(app)
       .post("/auth/login")
       .send({});  // Pas de données
 
     expect(res.status).toBe(400);
     expect(res.body.msg).toBe("Email et mot de passe sont requis!");
   });
 
   it("should return 401 if user is not found", async () => {
     // Mock de `UtilisateurMock.findOne` pour renvoyer `null` (utilisateur non trouvé)
     const mockFindOne = jest.spyOn(UtilisateurMock, "findOne").mockResolvedValue(null);
 
     const res = await request(app)
       .post("/auth/login")
       .send({
         email: "nonexistent@exemple.com",
         pwd: "wrongpassword",
       });
 
     expect(res.status).toBe(401);
     expect(res.body.msg).toBe("Email ou mot de passe incorrect!");
     mockFindOne.mockRestore();  // Restaure le mock après utilisation
   });
 
   it("should return 401 if password is incorrect", async () => {
     // Mock de `UtilisateurMock.findOne` pour renvoyer un utilisateur
     const mockUser = { email: "saidnichan6@gmail.com", pwd: "hashedpassword", cin: "123456789" };
     const mockFindOne = jest.spyOn(UtilisateurMock, "findOne").mockResolvedValue(mockUser);
 
     // Mock de `bcrypt.compare` pour simuler une comparaison échouée (mot de passe incorrect)
     bcrypt.compare.mockResolvedValue(false);
 
     const res = await request(app)
       .post("/auth/login")
       .send({
         email: "saidnichan6@gmail.com",
         pwd: "wrongpassword",
       });
 
     expect(res.status).toBe(401);
     expect(res.body.msg).toBe("Email ou mot de passe incorrect!");
     mockFindOne.mockRestore();
   });
 
   it("should return 200 and generate tokens for valid credentials", async () => {
     // Mock de `UtilisateurMock.findOne` pour renvoyer un utilisateur
     const mockUser = { email: "saidnichan6@gmail.com", pwd: "hashedpassword", cin: "123456789" };
     const mockFindOne = jest.spyOn(UtilisateurMock, "findOne").mockResolvedValue(mockUser);
 
     // Mock de `bcrypt.compare` pour simuler une comparaison réussie
     bcrypt.compare.mockResolvedValue(true);
 
     // Mock de la génération des tokens
     generateAccessToken.mockReturnValue("accessToken");
     generateRefreshToken.mockReturnValue({ refreshToken: "refreshToken", tokenID: "tokenID" });
 
     const res = await request(app)
       .post("/auth/login")
       .send({
         email: "saidnichan6@gmail.com",
         pwd: "password123",
       });
 
     expect(res.status).toBe(200);
     expect(res.body.msg).toBe("Connexion réussie");
      // Vérifie que les cookies sont définis
     mockFindOne.mockRestore();
   });
 
   it("should return 500 if there is a server error", async () => {
     // Simuler une erreur côté serveur lors de la recherche dans la base de données
     const mockFindOne = jest.spyOn(UtilisateurMock, "findOne").mockRejectedValue(new Error("Database error"));
 
     const res = await request(app)
       .post("/auth/login")
       .send({
         email: "saidnichan6@gmail.com",
         pwd: "password123",
       });
 
     expect(res.status).toBe(500);
     expect(res.body.msg).toBe("Erreur serveur lors de la connexion.");
     mockFindOne.mockRestore();
   });
 }); */
 