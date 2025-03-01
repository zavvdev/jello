module.exports = {
  username: () => "'^[a-z0-9_]*$'",
  email: () => "'^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,}$'",
  color: () => "'^#[0-9a-fA-F]{6}$'",
};
