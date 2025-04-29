import  express  from "express";

import { body } from "express-validator";



import {
  login,
  logout,
  sendcode,
  submitcode,
  resetpassword,
} from "../controllers/authControllers.js";

const router = express.Router();

router.post(
  "/login",
  [
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vous devez entrer votre email!")
      .isEmail()
      .withMessage("Email invalide!"),

    body("pwd")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vous devez entrer votre mot de passe!"),
  ],
  login
);

router.post("/logout", logout);

router.post(
  "/sendcode",
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Vous devez entrer votre email !")
    .isEmail()
    .withMessage("Email invalide!"),
  sendcode
);

router.post(
  "/submitcode",
  body("verificationCode")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Vous devez entrer le code de vérification !")
    .isLength({ min: 6, max: 6 })
    .withMessage("Le code doit contenir exactement 6 caractères."),
  submitcode
);

router.post(
  "/resetPassword",
  body("pwd")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Vous devez entrer votre nouveau mot de passe !")
    .isLength({ min: 8, max: 12 })
    .withMessage(
      "Le mot de passe doit contenir au moins 8 caractères et au plus 12."
    )
    .matches(/[a-z]/)
    .withMessage("Le mot de passe doit contenir une minuscule.")
    .matches(/[A-Z]/)
    .withMessage("Le mot de passe doit contenir une majuscule.")
    .matches(/[0-9]/)
    .withMessage("Le mot de passe doit contenir un chiffre.")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Le mot de passe doit contenir un caractère spécial."),
  resetpassword
);
// need refresh endpoint 
export default router;
