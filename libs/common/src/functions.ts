export const calcAge = (start: string, end: string) => {
  const date1 = new Date(start);
  const date2 = new Date(end);
  const diff = date1.getTime() - date2.getTime();
  // Convert the difference to years, months, and days
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30),
  );
  const days = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24),
  );

  // Print the difference in years, months, and days
  return years + ' years, ' + months + ' months, and ' + days + ' days';
};
