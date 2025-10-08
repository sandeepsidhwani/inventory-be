const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const SECRET_KEY = "abcdbc2344";

const AuthController = {
  // Register new user
  register: async (req, res) => {
    const { name, username, email, password, mobileno, gender } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        mobileno,
        gender,
      });
      res.json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Login user
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "User not found" });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign(
        {
          id: user.id,
          userId: user.id, // Add this line to include userId in the token
        },
        SECRET_KEY,
        { expiresIn: "24h" }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          mobileno: user.mobileno,
          gender: user.gender,
        },
      });
    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get user profile
  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ["id", "name", "username", "email", "mobileno", "gender"],
      });

      if (!user) return res.status(404).json({ error: "User not found" });

      res.json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: err.message });
    }
  },

  // Forgot password
  forgotPassword: async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await User.update(
        { password: hashedPassword },
        { where: { email } }
      );
      if (!user[0]) return res.status(404).json({ error: "User not found" });

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error("Error during password update:", err);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = AuthController;
