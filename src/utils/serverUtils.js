export const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTU";
  const randomChar = () =>
    characters[Math.floor(Math.random() * characters.length)];
  return randomChar() + randomChar() + randomChar() + randomChar();
};
