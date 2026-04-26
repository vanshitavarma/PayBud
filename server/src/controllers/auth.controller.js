const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email: rawEmail, password } = req.body;

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const email = rawEmail.toLowerCase().trim();

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // generate upiId
    const baseName = name.replace(/\s+/g, '').toLowerCase();
    const upiId = `${baseName}${Math.floor(1000 + Math.random() * 9000)}@paysplit`;

    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      upiId
    });

    // Deduct 1000 from central bank for new user onboarding
    const Bank = require("../models/bank.model");
    let bank = await Bank.findOne();
    if (!bank) {
        bank = await Bank.create({ totalBalance: 1000000 });
    }
    bank.totalBalance -= 1000;
    bank.history.push({
        userId: user._id,
        amount: 1000,
        type: 'onboarding'
    });
    await bank.save();

    const { password: _, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign({ userId: user._id }, 'mysecret123', { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
      bankBalance: bank.totalBalance
    });

  } catch (err) {
    console.error('Registration Error Details:', {
      error: err.name,
      message: err.message,
      stack: err.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: err.code === 11000 ? "Email or UPI ID already exists" : (err.message || "Registration failed") 
    });
  }
};


// ✅ LOGIN
exports.login = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;

    const email = rawEmail.toLowerCase().trim();

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      'mysecret123',
      { expiresIn: "1d" }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET ME
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};