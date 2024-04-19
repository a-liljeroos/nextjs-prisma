const bcrypt = require("bcrypt");
const saltRounds = 10;

export const hash = async (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const compare = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export default { hash, compare };
