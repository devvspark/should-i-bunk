export const calculateAttendance = (
  total,
  attended,
  minimumRequired
) => {
  const currentPercentage = (attended / total) * 100;

  // Safe bunk calculation
  let safeBunks = 0;
  let tempAttended = attended;
  let tempTotal = total;

  while (
    ((tempAttended / (tempTotal + 1)) * 100) >= minimumRequired
  ) {
    tempTotal++;
    safeBunks++;
  }

  // Classes needed to reach minimum (if below)
  let classesToTarget = 0;
  if (currentPercentage < minimumRequired) {
    while (
      ((attended + classesToTarget) /
        (total + classesToTarget)) *
        100 <
      minimumRequired
    ) {
      classesToTarget++;
    }
  }

  return {
    currentPercentage: Number(currentPercentage.toFixed(1)),
    isSafe: currentPercentage >= minimumRequired,
    safeBunks,
    classesToTarget,
  };
};
