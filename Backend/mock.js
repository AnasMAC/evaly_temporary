import SequelizeMock from 'sequelize-mock';

// Créer une instance mock de Sequelize
const sequelizeMock = new SequelizeMock();

// Simuler un modèle (par exemple, Utilisateur)
const UtilisateurMock = sequelizeMock.define('Utilisateur', {
  email: 'saidnichan6@gmail.com',
  pwd: 'hashedpassword',
  cin: '123456789',
  nom: 'Said',
  prenom: 'Nichan',
  role: 'administrateur',
});




const VerificationCodeMock = sequelizeMock.define('VerificationCode', {
    idUtilisateur: '123456789',
    idVerification: '123abc',
    expireAt: new Date(Date.now() + 2 * 60 * 1000),
  });
  
  // Mock de la méthode `findOne` pour renvoyer un code valide
  VerificationCodeMock.findOne = jest.fn().mockResolvedValue({
    idVerification: '123abc',
    idUtilisateur: '123456789',
    expireAt: new Date(Date.now() + 2 * 60 * 1000),
  });
  
  // Mock de la méthode `create` pour simuler la création d'un code de vérification
  VerificationCodeMock.create = jest.fn().mockResolvedValue({
    idVerification: '123abc',
    idUtilisateur: '123456789',
    expireAt: new Date(Date.now() + 2 * 60 * 1000),
  });
  
  // Mock de la méthode `destroy` pour simuler la suppression d'un code de vérification
  VerificationCodeMock.destroy = jest.fn().mockResolvedValue(true);
  
  export { VerificationCodeMock };
// Exporter pour l'utiliser dans tes tests
export { UtilisateurMock };
