const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPRSTU";
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

const canFormWords = (words, letters) => {
  // Helper function to count the frequency of each letter in an array
  const letterCount = (arr) => {
    return arr.reduce((count, letter) => {
      count[letter] = (count[letter] || 0) + 1;
      return count;
    }, {});
  };

  // Count the frequency of letters in the letters array
  const lettersFreq = letterCount(letters);

  // Get the 5th letter from the letters array
  const mandatoryLetter = letters[4];

  // Function to check if a word can be formed using the available letters
  const canFormWord = (word, freq) => {
    const wordFreq = letterCount(word.split(''));

    // Check if the word contains the mandatory letter
    if (!word.includes(mandatoryLetter)) {
      return false;
    }

    if (word.length < 4 || word.length > 9) {
      return false;
    }

    // Check if the word can be formed with the available letters
    for (let letter in wordFreq) {
      if (wordFreq[letter] > (freq[letter] || 0)) {
        return false;
      }
    }
    return true;
  };

  // Filter the words array to include only the words that can be formed
  return words.filter(word => canFormWord(word, lettersFreq));
};


// Export the function
export { generateRandomCode, splitAndShuffleString, shuffleArray, canFormWords };
