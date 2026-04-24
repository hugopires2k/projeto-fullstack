const jwt = require('jsonwebtoken');
const User = require('../models/User');

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email e password são obrigatórios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Já existe um usuário com esse email.' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e password são obrigatórios.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao realizar login.', error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar perfil.', error: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    await user.save();

    return res.status(200).json({ message: 'Usuário atualizado com sucesso.', user });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
}

async function updatePassword(req, res) {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter ao menos 6 caracteres.' });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.password = password;
    await user.save();

    return res.status(200).json({ message: 'Senha atualizada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar senha.', error: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    return res.status(200).json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao remover usuário.', error: error.message });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  getUsers,
  getUserById,
  updateUser,
  updatePassword,
  deleteUser
};
