export const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomChar = () =>
    characters[Math.floor(Math.random() * characters.length)];
  return randomChar() + randomChar() + randomChar() + randomChar();
};
