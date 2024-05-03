function parseDate(input: string): Date | null {
  // Check if the input has a valid format (MMDD)
  const match = input.match(/^(\d{2})(\d{2})$/);

  if (match) {
    const month = parseInt(match[1]);
    const day = parseInt(match[2]);

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Create a new Date object with the current year, parsed month, and day
    const parsedDate = new Date(currentYear, month - 1, day);

    // Check if the parsed date is valid
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate;
    }
  }

  return null; // Invalid input
}

export default parseDate;