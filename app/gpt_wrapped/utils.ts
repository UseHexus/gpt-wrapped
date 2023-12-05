const POLITE_WORDS = [
  "please",
  "thank",
  "excuse",
  "pardon",
  "appreciate",
  "grateful",
  "sorry",
  "kindly",
  "respectfully",
  "apologize",
  "respect",
];
// Refer to a list from https://www.google.com/search?q=ban+words+list
const BANNED_WORDS = [];
const REPLIES = [
  "As an Ai",
  "I'm sorry, but I",
  "Access to real-time",
  "Language model",
  "Roman Empire",
];

export function getLongestStreakOfDates(dateSet: Set<any>) {
  if (!dateSet.size) {
    return 0;
  }
  const dateArray = Array.from(dateSet).sort((a, b) => a - b);
  let currentStreak = 1;
  let longestStreak = 1;
  for (let i = 1; i < dateArray.length; i++) {
    const diffInDays = Math.floor(
      ((new Date(dateArray[i - 1]) as any) - (new Date(dateArray[i]) as any)) /
        (1000 * 60 * 60 * 24),
    );
    if (diffInDays === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);
  }
  return longestStreak;
}

export function getUserData(fileData: []) {
  let activeDaysMap = {};
  let maxTimeOfDayMap = {};
  let dateMap = {};
  let replies = {};
  let questions = 0;
  let polite = 0;
  let banned = 0;
  let dateSet = new Set();

  for (let reply of REPLIES) {
    replies[reply] = 0;
  }

  for (let value of fileData) {
    let mapping = (value as any).mapping;
    for (let key in mapping) {
      if (mapping[key]?.message?.author?.role === "assistant") {
        let content = mapping[key].message?.content?.parts
          ?.join(" ")
          .toLocaleLowerCase();
        if (!content) {
          continue;
        }
        for (let reply of REPLIES) {
          replies[reply] += content.includes(reply.toLocaleLowerCase()) ? 1 : 0;
        }
      }
    }
  }

  for (let value of fileData) {
    let mapping = (value as any).mapping;
    for (let key in mapping) {
      if (mapping[key]?.message?.author?.role === "user") {
        let createDateTime = new Date(mapping[key].message.create_time * 1000);
        if (createDateTime < new Date("01/01/2023")) {
          continue;
        }
        let contentArr = mapping[key].message.content.parts
          .join(" ")
          .toLocaleLowerCase()
          .split(" ");
        polite += POLITE_WORDS.some((word) => contentArr.includes(word))
          ? 1
          : 0;
        banned += BANNED_WORDS.some((word) => contentArr.includes(word))
          ? 1
          : 0;

        dateSet.add(createDateTime.toLocaleDateString());
        dateMap[createDateTime.toLocaleDateString()] =
          (dateMap[createDateTime.toLocaleDateString()] ?? 0) + 1;
        activeDaysMap[createDateTime.getDay()] =
          (activeDaysMap[createDateTime.getDay()] ?? 0) + 1;
        maxTimeOfDayMap[createDateTime.getHours()] =
          (maxTimeOfDayMap[createDateTime.getHours()] ?? 0) + 1;
        questions += 1;
      }
    }
  }

  let timeString = parseInt(getMaxValue(maxTimeOfDayMap));

  return {
    activeDays: getMaxValue(activeDaysMap),
    maxTimeOfDay:
      ((timeString + 11) % 12) + 1 + (timeString >= 12 ? "PM" : "AM"),
    questions: questions,
    polite: polite,
    banned: banned,
    replies: replies,
    numDays: dateSet.size,
    longestStreakOfDates: getLongestStreakOfDates(dateSet),
    dateMap: dateMap,
  };
}
function getMaxValue(obj) {
  try {
    return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
  } catch (e) {
    return "0"; // This is technically wrong.
  }
}
