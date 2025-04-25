module.exports = {
  sessionExpirationTime: "1 day",
  usernamePattern: () => "'^[a-z0-9_]*$'",
  emailPattern: () => "'^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,}$'",
  colorPattern: () => "'^#[0-9a-fA-F]{6}$'",
};
