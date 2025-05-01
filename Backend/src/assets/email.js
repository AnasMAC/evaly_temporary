import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Hôte SMTP configuré dans les variables d'environnement
  port: 465,  // Port configuré dans les variables d'environnement
  auth: {
    user: 'said.nichan14@gmail.com',  // Votre email (par exemple, "example@gmail.com")
    pass: 'qqorhwcyrnxsoncc',  // Votre mot de passe ou mot de passe d'application
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
    from: 'said.nichan14@gmail.com',  // Utilisation de l'email de l'expéditeur configuré dans les variables d'environnement
    to: userEmail,  // L'email du destinataire
    subject: 'Code de vérification pour la réinitialisation de votre mot de passe',
    html: `
      <p>Bonjour,</p>
      <p>Nous avons bien reçu une demande de réinitialisation de mot de passe pour votre compte. Pour procéder, veuillez entrer le code de vérification ci-dessous :</p>
      <span style="font-size: 24px; color: #1a73e8; font-weight: bold;">${verificationCode}</span>
      <p>Ce code est valable pendant 15 minutes. Après ce délai, vous devrez demander un nouveau code de vérification.</p>
      <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
      <p>Cordialement, <br>L'équipe de support de <strong> Evaly</strong></p>
    `,  // Message de l'email
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
