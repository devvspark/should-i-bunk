/* ========== DAYS OF WEEK ========== */
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/* ========== CLASS TYPES ========== */
export const CLASS_TYPES = ["Lecture", "Lab", "Tutorial", "Practical", "Other"];

/* ========== TIME SLOTS ========== */
export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
];

/* ========== GROUP CLASSES BY DAY ========== */
export const groupClassesByDay = (classes) => {
  const grouped = {};

  DAYS_OF_WEEK.forEach((day) => {
    grouped[day] = [];
  });

  classes.forEach((cls) => {
    if (grouped[cls.day]) {
      grouped[cls.day].push(cls);
    }
  });

  // Sort classes by start time within each day
  Object.keys(grouped).forEach((day) => {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return grouped;
};

/* ========== GET COLOR FOR CLASS TYPE ========== */
export const getClassTypeColor = (classType) => {
  const colors = {
    Lecture: "bg-blue-50 border-blue-200 text-blue-900",
    Lab: "bg-green-50 border-green-200 text-green-900",
    Tutorial: "bg-purple-50 border-purple-200 text-purple-900",
    Practical: "bg-orange-50 border-orange-200 text-orange-900",
    Other: "bg-gray-50 border-gray-200 text-gray-900",
  };
  return colors[classType] || colors.Other;
};

/* ========== GET CLASS TYPE BADGE COLOR ========== */
export const getClassTypeBadgeColor = (classType) => {
  const colors = {
    Lecture: "bg-blue-100 text-blue-800",
    Lab: "bg-green-100 text-green-800",
    Tutorial: "bg-purple-100 text-purple-800",
    Practical: "bg-orange-100 text-orange-800",
    Other: "bg-gray-100 text-gray-800",
  };
  return colors[classType] || colors.Other;
};

/* ========== VALIDATE TIME FORMAT ========== */
export const isValidTimeFormat = (time) => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/* ========== CHECK TIME OVERLAP ========== */
export const checkTimeOverlap = (startTime1, endTime1, startTime2, endTime2) => {
  return startTime1 < endTime2 && endTime1 > startTime2;
};

/* ========== SORT CLASSES BY DAY AND TIME ========== */
export const sortClassesByDayAndTime = (classes) => {
  return classes.sort((a, b) => {
    const dayComparison = DAYS_OF_WEEK.indexOf(a.day) - DAYS_OF_WEEK.indexOf(b.day);
    if (dayComparison !== 0) return dayComparison;
    return a.startTime.localeCompare(b.startTime);
  });
};

/* ========== CALCULATE CLASS DURATION ========== */
export const getClassDuration = (startTime, endTime) => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;

  const durationMin = endTotalMin - startTotalMin;
  const hours = Math.floor(durationMin / 60);
  const minutes = durationMin % 60;

  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};
