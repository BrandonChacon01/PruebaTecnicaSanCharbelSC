import jwt from 'jsonwebtoken';

// MIDDLEWARE PARA VERIFICAR QUE EL USUARIO ESTÁ AUTENTICADO CON UN TOKEN
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'ERROR. Token invalido.' });
    }

    req.user = user;
    next();
  });
};