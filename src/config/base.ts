export default () => ({
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET_KEY,
  googleId: process.env.GOOGLE_CLIENT_ID,
  googleSecret: process.env.GOOGLE_CLIENT_SECRET,
  CorsOrigin: process.env.CORS_ORIGIN
});
