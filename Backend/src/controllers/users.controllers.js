import bcrypt from 'bcryptjs';
import { getConnection } from "../database/connection.js";

// REGISTRO PARA LA CREACION DE UN NUEVO USUARIO
export const postNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username y contraseña son requeridos' });
  }

  try {
    const connection = await getConnection();

    // Validar que el username sea único
    const [existing] = await connection.execute(
      'SELECT user_id FROM users WHERE username = ? LIMIT 1',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'El username ya está en uso.' });
    }

    // Hashear contraseña y guardar
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await connection.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, passwordHash]
    );

    return res.status(201).json({ message: 'Usuario creado exitosamente.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor.' });
  }
};