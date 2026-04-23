import dotenv from "dotenv";

dotenv.config();

const hasTemplatePlaceholders = (value) => /<[^>]+>/.test(String(value || ""));

const buildAtlasUriFromParts = () => {
  const user = process.env.ATLAS_USER;
  const password = process.env.ATLAS_PASSWORD;
  const cluster = process.env.ATLAS_CLUSTER;
  const database = process.env.ATLAS_DB || "tuan_creations";
  const appName = process.env.ATLAS_APP_NAME || "tuan-creations-backend";

  if (!user || !password || !cluster) {
    return null;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  return `mongodb+srv://${encodedUser}:${encodedPassword}@${cluster}.mongodb.net/${database}?retryWrites=true&w=majority&appName=${encodeURIComponent(appName)}`;
};

const resolveMongoUri = () => {
  const configured = process.env.MONGODB_URI;

  if (configured && !hasTemplatePlaceholders(configured)) {
    return configured;
  }

  const atlasUri = buildAtlasUriFromParts();
  if (atlasUri) {
    return atlasUri;
  }

  return "mongodb://127.0.0.1:27017/tuan_creations";
};

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: resolveMongoUri(),
  jwtSecret: process.env.JWT_SECRET || "replace-this-in-production",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
};