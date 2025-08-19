import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// FUNCION PARA GENERAR EL TOKEN DE AUTENTICACIÓN CON user_id y username
export const generateToken = (user) => {
  const payload = {
    user_id: user.user_id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: '12h',
  };

  return jwt.sign(payload, secret, options);
};