import { validationResult, matchedData } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../assets/tokens.js";
import { sendVerificationEmail } from "../assets/email.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import Utilisateur from '../models/utilisateur.js';
import VerificationCode from '../models/VerificationCode.js';
import refreshToken from '../models/RefreshToken.js';

// --- LOGIN ---
export const login = async (req, res) => {
  const { email, pwd } = req.body;

  // Vérification des données obligatoires
  if (!email || !pwd) {
    return res.status(400).json({ msg: "Email et mot de passe sont requis!" });
  }

  try {
    const user = await Utilisateur.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect!" });
    }

    const match = await bcrypt.compare(pwd, user.pwd);
    if (!match) {
      return res.status(401).json({ msg: "Email ou mot de passe incorrect!" });
     }

    
    

    // Génération des tokens
    const accessToken = generateAccessToken(user);
    const { refreshToken: newRefreshToken, tokenID } = generateRefreshToken(user);

    // Expiration du refresh token (7 jours)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Sauvegarde du refresh token dans la base de données
    await refreshToken.create({
      idtoken: tokenID,
      idUtilisateur: user.cin,
      expireAt: expiresAt,
    });

    // Envoi des cookies avec les tokens
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 13 * 60 * 1000, // 13 minutes
    }); 
    
    return res.status(200).json({role:user.role , cin:user.cin});

  } catch (error) {
    console.log("Erreur lors de la connexion:", error);
    return res.status(500).json({ msg: "Erreur serveur lors de la connexion." });
  }
};

// --- REFRESH ACCESS TOKEN ---
export const refreshAccessToken = async (req, res, next) => {
  const token = req.cookies.accessToken;

  try {
    jwt.verify(token, process.env.ACCESS_SECRET);
    return next();
  } catch {
    const refToken = req.cookies.refreshToken;
    if (!refToken) {
      return res.status(401).json({ msg: "Veuillez vous connecter à nouveau!" });
    }

    try {
      const decoded = jwt.verify(refToken, process.env.REFRESH_SECRET);
      const cin = decoded.cin;

      const user = await Utilisateur.findOne({ where: { cin } });
      if (!user) {
        return res.status(404).json({ msg: "Utilisateur non trouvé." });
      }

      const newAccessToken = generateAccessToken(user);
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 13 * 60 * 1000,
      });

      return next();
    } catch (err) {
      console.error("Erreur lors du refresh token:", err);
      return res.status(401).json({ msg: "Session expirée. Veuillez vous reconnecter." });
    }
  }
};

// --- LOGOUT ---
export const logout = async (req, res) => {
  const refToken = req.cookies.refreshToken;

  if (!refToken) {
    return res.sendStatus(204);  // Pas de token, donc aucune action
  }

  try {
    const decoded = jwt.verify(refToken, process.env.REFRESH_SECRET);
    const tokenID = decoded.tokenID;

    // Suppression du refresh token dans la base de données
    await refreshToken.destroy({ where: { idUtilisateur: tokenID } });

    // Suppression des cookies du client
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.sendStatus(200);
  } catch (err) {
    console.error("Erreur lors de la déconnexion:", err);
    return res.status(400).json({ msg: "Erreur lors de la déconnexion." });
  }
};

// --- SEND CODE (Verification Code) ---
export const sendcode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Erreur de validation dans sendcode:', errors.array());
    return res.status(400).json({ msg: "Erreur de validation des données." });
  }

  const { email } = matchedData(req);

  try {
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé pour l'email : " + email });
    }

    // Génération du code de vérification
    const verificationCode = crypto.randomBytes(3).toString("hex");

    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    // Sauvegarde dans la base de données
    await VerificationCode.create({
      idUtilisateur: user.cin,
      idVerification: verificationCode,
      expireAt: expiresAt,
    });

    // Envoi du code de vérification par email
    await sendVerificationEmail(email, verificationCode);

    const token = jwt.sign({ cin: user.cin }, process.env.RESET_SECRET, { expiresIn: "15m" });

    // Envoi du token de réinitialisation dans un cookie
    res.cookie("resetToken", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,  // 15 minutes
    });

    return res.status(200).json({ msg: "Code de vérification envoyé." });

  } catch (error) {
    console.error("Erreur pendant l'envoi du code de vérification:", error);
    return res.status(500).json({ msg: "Erreur serveur lors de l'envoi du code." });
  }
};

// --- SUBMIT CODE (Validation) ---
export const submitcode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Erreur de validation dans submitcode:', errors.array());
    return res.status(400).json({ msg: "Erreur de validation des données." });
  }

  const { verificationCode } = matchedData(req);

  try {
    const codeEntry = await VerificationCode.findOne({ where: { idVerification: verificationCode } });
    if (!codeEntry || codeEntry.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Code invalide ou expiré." });
    }

    // Supprimer le code une fois validé
    await codeEntry.destroy();

    return res.status(200).json({ msg: "Code de vérification validé." });

  } catch (error) {
    console.error("Erreur lors de la validation du code :", error);
    return res.status(500).json({ msg: "Erreur serveur lors de la validation du code." });
  }
};

// --- RESET PASSWORD ---
export const resetpassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Erreur de validation dans resetpassword:', errors.array());
    return res.status(400).json({ msg: "Erreur de validation des données." });
  }

  const { pwd } = matchedData(req);
  const hashedPass = await bcrypt.hash(pwd, 10);

  const token = req.cookies.resetToken;
  if (!token) {
    return res.status(401).json({ msg: "Aucun token trouvé pour réinitialiser le mot de passe." });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.RESET_SECRET);
  } catch (err) {
    console.error('Erreur de vérification du token:', err);
    return res.status(403).json({ msg: "Token invalide ou expiré." });
  }

  try {
    const updated = await Utilisateur.update(
      { pwd: hashedPass },
      { where: { cin: decoded.cin } }
    );

    res.clearCookie("resetToken");

    if (updated[0] === 0) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    await VerificationCode.destroy({ where: { idUtilisateur: decoded.cin } });

    return res.status(200).json({ msg: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", err);
    return res.status(500).json({ msg: "Erreur serveur lors de la réinitialisation du mot de passe." });
  }
};
