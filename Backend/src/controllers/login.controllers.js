import bcrypt from 'bcryptjs';
import { getConnection } from "../database/connection.js";
import { generateToken } from '../middleware/generateToken.js';

// LOGIN: VERIFICA USUARIO Y GENERA TOKEN
export const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación de campos obligatorios
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    const connection = await getConnection();

    // Buscar usuario en la base de datos
    const [rows] = await connection.execute(
      'SELECT user_id, username, password FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    
    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Preparar respuesta del usuario (sin password) para generar el token y mandarlo en la respuesta
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
    };

    const token = generateToken(userResponse);

    res.status(200).json({ 
      message: 'Login exitoso',
      token, 
      user: userResponse 
    });

  } catch (error) {
    console.error('Error en postLogin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};