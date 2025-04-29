import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // Hôte SMTP configuré dans les variables d'environnement
  port: process.env.EMAIL_PORT,  // Port configuré dans les variables d'environnement
  auth: {
    user: process.env.EMAIL_USER,  // Votre email (par exemple, "example@gmail.com")
    pass: process.env.EMAIL_PASS,  // Votre mot de passe ou mot de passe d'application
  },
});

// Vérification de la configuration du transporteur
transporter.verify((error, success) => {
  if (error) {
    console.error("Erreur dans la configuration du transporteur SMTP:", error);
  } else {
    console.log("Serveur SMTP est prêt à l'envoi !");
  }
});

// Fonction pour envoyer l'email de vérification
export const sendVerificationEmail = async (userEmail, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Utilisation de l'email de l'expéditeur configuré dans les variables d'environnement
    to: userEmail,  // L'email du destinataire
    subject: "Code de vérification pour la réinitialisation du mot de passe.",
    html: `<p>Entrez ce code de vérification pour réinitialiser votre mot de passe </p> : <h1>${verificationCode}</h1>`,  // Message de l'email
  };

  try {
    // Attendre l'envoi de l'email avec le code de vérification
    await transporter.sendMail(mailOptions);
    console.log("Code de vérification est envoyé !");
  } catch (error) {
    // Gestion des erreurs lors de l'envoi de l'email
    console.error("Une erreur est survenue pendant l'envoi du code de vérification:", error);
    console.error("Erreur complète:", error);
  }
};
