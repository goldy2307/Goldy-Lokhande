import { Router } from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import Message from "../models/Message.js";
import requireAuth from "../middleware/auth.js";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again in a while." },
});

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const escapeHtml = (v = "") =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const OWNER_NAME = "Goldy Lokhande";
const BRAND = {
  bg: "#050505",
  panel: "#121212",
  line: "#242017",
  gold: "#d9b24c",
  goldSoft: "#f0dfa0",
  textHi: "#f5f5f5",
  textMid: "#a8a8a8",
};

// Email sent TO the portfolio owner — new lead notification.
function adminEmailHtml({ name, email, subject, message }) {
  return `
  <div style="background:${BRAND.bg};padding:32px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:${BRAND.panel};border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:28px 32px;border-bottom:1px solid ${BRAND.line};">
          <span style="font-family:'Courier New',monospace;color:${BRAND.gold};font-size:12px;letter-spacing:2px;text-transform:uppercase;">Portfolio</span>
          <h1 style="margin:8px 0 0;color:${BRAND.textHi};font-size:20px;">New message from your site</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <table role="presentation" width="100%" style="margin-bottom:20px;">
            <tr><td style="padding:6px 0;color:${BRAND.textMid};font-size:13px;width:90px;">Name</td><td style="padding:6px 0;color:${BRAND.textHi};font-size:14px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;color:${BRAND.textMid};font-size:13px;">Email</td><td style="padding:6px 0;color:${BRAND.goldSoft};font-size:14px;">${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0;color:${BRAND.textMid};font-size:13px;">Subject</td><td style="padding:6px 0;color:${BRAND.textHi};font-size:14px;">${escapeHtml(subject || "—")}</td></tr>
          </table>
          <div style="height:1px;background:${BRAND.line};margin:20px 0;"></div>
          <p style="color:${BRAND.textHi};font-size:14.5px;line-height:1.7;white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:18px 32px;border-top:1px solid ${BRAND.line};">
          <span style="font-family:'Courier New',monospace;color:${BRAND.textMid};font-size:11px;">Sent from the contact form on your portfolio</span>
        </td>
      </tr>
    </table>
  </div>`;
}

// Auto-reply sent TO the visitor who submitted the form.
function userEmailHtml({ name, message }) {
  return `
  <div style="background:${BRAND.bg};padding:32px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:${BRAND.panel};border:1px solid ${BRAND.line};border-radius:14px;overflow:hidden;">
      <tr>
        <td style="padding:36px 32px 24px;text-align:center;background:linear-gradient(135deg, rgba(217,178,76,0.12), rgba(5,5,5,0));">
          <div style="width:52px;height:52px;border-radius:50%;background:${BRAND.bg};border:1px solid ${BRAND.gold};display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="color:${BRAND.gold};font-size:22px;line-height:52px;">✓</span>
          </div>
          <h1 style="margin:0;color:${BRAND.textHi};font-size:21px;">Thanks for reaching out, ${escapeHtml(name)}</h1>
          <p style="margin:10px 0 0;color:${BRAND.textMid};font-size:14px;">Your message reached ${OWNER_NAME} — expect a reply soon.</p>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;">
          <div style="font-family:'Courier New',monospace;color:${BRAND.gold};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;">Your message</div>
          <div style="background:${BRAND.bg};border:1px solid ${BRAND.line};border-radius:10px;padding:16px 18px;">
            <p style="color:${BRAND.textHi};font-size:14px;line-height:1.7;white-space:pre-wrap;margin:0;">${escapeHtml(message)}</p>
          </div>

          <div style="height:1px;background:${BRAND.line};margin:28px 0;"></div>

          <p style="color:${BRAND.textMid};font-size:13.5px;line-height:1.7;margin:0 0 18px;">
            In the meantime, feel free to look at recent projects or connect on GitHub / LinkedIn from the portfolio.
          </p>

          <div style="text-align:center;">
            <span style="display:inline-block;background:linear-gradient(135deg, ${BRAND.gold}, ${BRAND.goldSoft});color:${BRAND.bg};font-weight:bold;font-size:13px;padding:12px 26px;border-radius:999px;">
              — ${OWNER_NAME}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;border-top:1px solid ${BRAND.line};text-align:center;">
          <span style="font-family:'Courier New',monospace;color:${BRAND.textMid};font-size:11px;">This is an automated confirmation — no need to reply to this email.</span>
        </td>
      </tr>
    </table>
  </div>`;
}

// POST /api/contact -> public, sends email to both the owner and the
// visitor (auto-reply), and stores a copy of the message.
router.post("/", contactLimiter, async (req, res) => {
  const { name, email, subject, message, honeypot } = req.body || {};

  // Simple honeypot field to trip up bots (kept empty by real users)
  if (honeypot) return res.json({ ok: true });

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ error: "Name, a valid email, and a message are required." });
  }

  try {
    await Message.create({ name, email, subject, message });

    const transporter = buildTransporter();
    const fromAddress = `"${OWNER_NAME} — Portfolio" <${process.env.SMTP_USER}>`;

    await Promise.all([
      // 1. Notify the site owner
      transporter.sendMail({
        from: fromAddress,
        to: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,
        replyTo: email,
        subject: `[Portfolio] ${subject || "New message"} — from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: adminEmailHtml({ name, email, subject, message }),
      }),
      // 2. Auto-reply to the visitor
      transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: `Thanks for reaching out, ${name} — message received`,
        text: `Hi ${name},\n\nThanks for your message — it reached ${OWNER_NAME} and you'll hear back soon.\n\nYour message:\n${message}\n\n— ${OWNER_NAME}`,
        html: userEmailHtml({ name, message }),
      }),
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err.message);
    res.status(500).json({ error: "Could not send message right now. Please try again shortly." });
  }
});

// GET /api/contact -> admin only, view stored messages
router.get("/", requireAuth, async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 }).limit(200);
  res.json(messages);
});

export default router;