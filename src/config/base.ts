export default () => ({
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET: process.env.GOOGLE_CLIENT_SECRET
});
