const extractNumbers = (input: string): string | null => {
  const regex = /[0-9]+/g; // This regex matches one or more digits

  const matches = input.match(regex);

  if (matches) {
    const numbers = matches.join(""); // Join all matched numbers together
    return numbers;
  } else {
    return null;
  }
};

export default extractNumbers;
