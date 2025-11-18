const prisma = require('../db');

let nextId = 3;

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    // 生成哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword, // ✅ 存哈希
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('createUser error:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        // 只更新有传入的字段
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('updateUser error:', error);

    if (error.code === 'P2025') {
      // 记录不存在
      return res.status(404).json({ message: 'User not found' });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const deleted = await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: 'User deleted',
      user: deleted,
    });
  } catch (error) {
    console.error('deleteUser error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};
