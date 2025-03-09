export var COOKIE_CONFIG = (token) => ({
  name: process.env.COOKIE_NAME,
  value: token,
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  domain: process.env.COOKIE_DOMAIN,
});
