import { Router } from "express";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

const router = Router();

// Slows down brute force login attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Credentials are compared against ADMIN_EMAIL / ADMIN_PASSWORD in .env.
 * On success returns a short-lived JWT used to call the protected
 * content-editing endpoints.
 */
router.post("/login", loginLimiter, (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const validEmail = email.trim().toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
  const validPassword = password === process.env.ADMIN_PASSWORD;

  if (!validEmail || !validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export default router;
