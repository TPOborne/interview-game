const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTU";
  const randomChar = () =>
    characters[Math.floor(Math.random() * characters.length)];
  return randomChar() + randomChar() + randomChar() + randomChar();
};

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Function to rotate an array by one position
const rotateArray = (array) => {
  array.push(array.shift());
  return array;
};

// Function to split a string into an array of letters and shuffle it
const splitAndShuffleString = (str) => {
  // Split the string into an array of letters
  const arrayOfLetters = str.split('');
  
  // Shuffle the array of letters
  let shuffledArray = shuffleArray(arrayOfLetters);

  // Ensure the 4th item is not one of the specified letters
  const forbiddenLetters = ['W', 'X', 'Y', 'Z', 'J', 'K', 'Q'];
  while (forbiddenLetters.includes(shuffledArray[4])) {
      shuffledArray = rotateArray(shuffledArray);
  }
  
  return shuffledArray;
};

// Export the function
export { generateRandomCode, splitAndShuffleString, shuffleArray };
