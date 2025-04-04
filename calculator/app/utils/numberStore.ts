// A simple in-memory store to maintain numbers for each type
// We use a Map to store numbers for each type (p, f, e, r)
// Each type has a window of numbers with a maximum size

const WINDOW_SIZE = 10;

interface NumberStore {
  [key: string]: number[];
}

// Initialize store
const numberStore: NumberStore = {
  p: [], // prime
  f: [], // fibonacci
  e: [], // even
  r: [], // random
};

// Get the current window state for a specific number type
export const getWindowState = (type: string): number[] => {
  return [...(numberStore[type] || [])];
};

// Updated the window with new numbers and return the previous and current state
export const updateWindow = (
  type: string,
  newNumbers: number[]
): { prevState: number[]; currState: number[] } => {
  if (!numberStore[type]) {
    numberStore[type] = [];
  }

  const prevState = [...numberStore[type]];
  
  // Filtered out duplicates and add only unique numbers
  const uniqueNewNumbers = newNumbers.filter(
    (num) => !numberStore[type].includes(num)
  );
  
  let updatedWindow = [...numberStore[type]];
  
  // Added unique numbers, respecting the window size
  for (const num of uniqueNewNumbers) {
    if (updatedWindow.length >= WINDOW_SIZE) {
      // If window is full, replace the oldest number
      updatedWindow.shift();
    }
    updatedWindow.push(num);
  }
  
  // Update the store
  numberStore[type] = updatedWindow;
  
  return {
    prevState,
    currState: updatedWindow,
  };
};

// Calculate the average of numbers in the window
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}; 