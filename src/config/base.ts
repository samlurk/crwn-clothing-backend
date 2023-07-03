export default () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET_KEY,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN,
  strapiApiKey: process.env.STRAPI_SECRET_KEY
});
