import mongoose from "mongoose";

/**
 * Single-document CMS. There is only ever one Content document (singleton,
 * fetched/created via key: "portfolio"). Every field the admin panel can
 * edit lives here so the frontend can render entirely from the API.
 */
const ContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "portfolio", unique: true },

    hero: {
      name: String,
      roles: [String], // rotating typed roles
      tagline: String,
      avatar: String, // image URL / base64
      resumeUrl: String,
    },

    about: {
      bio: String,
      photo: String, // image URL / base64
      location: String,
      stats: [{ label: String, value: String }],
    },

    skills: [
      {
        group: String,
        items: [String],
      },
    ],

    journey: [
      {
        org: String,
        role: String,
        period: String,
        location: String,
        points: [String],
        image: String,
      },
    ],

    projects: [
      {
        title: String,
        tech: String,
        description: String,
        link: String,
        image: String,
      },
    ],

    certifications: [
      {
        title: String,
        issuer: String,
        date: String,
        image: String, // badge / certificate image, URL or base64
      },
    ],

    achievements: [String],

    platforms: [
      {
        name: String,
        url: String,
        icon: String, // key used by frontend icon map
      },
    ],

    contactEmail: String,
    contactPhone: String,
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);