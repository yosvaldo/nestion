import { genSalt, hash, compare } from "bcrypt";

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await genSalt(12);
  return await hash(plainPassword, salt);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(plainPassword, hashedPassword);
};

export { hashPassword, comparePassword };