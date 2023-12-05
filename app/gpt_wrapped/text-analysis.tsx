import nlp from "compromise";

const STOPWORDS = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
];
export function getDataAnalysis(fileData: [], useNLP) {
  let allText = [];

  for (let value of fileData) {
    let mapping = (value as any).mapping;
    for (let key in mapping) {
      if (mapping[key]?.message?.author?.role === "user") {
        let contentArr = mapping[key].message.content.parts.join(".");
        allText.push(contentArr);
      }
    }
  }

  if (useNLP) {
    let doc = nlp(
      allText
        .join(" ")
        .substring(0, 100000)
        .replace(/[^\w\s]/gi, ""),
    ); // limit processing
    let wordFrequency = doc
      .nouns()
      .out("topk") // sort by frequency
      .concat(doc.adjectives().out("topk"))
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 100);
    return {
      words: wordFrequency,
    };
  } else {
    let docWordFrequency = mostFrequentWord(allText);
    return { words: docWordFrequency };
  }
}

function mostFrequentWord(allText) {
  const words = allText
    .join(" ")
    .substring(0, 100000)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .toLowerCase()
    .split(/\s+/);

  // Count the frequency of each word
  const wordCounts = {};
  words.forEach((word) => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Sort the words based on their frequencies
  const sortedWords = Object.entries(wordCounts).sort(
    (a, b) => (b as any)[1] - (a as any)[1],
  );

  // Take the top k words
  const topKWords = sortedWords.slice(0, 300);
  return removeStopWords(topKWords);
}

function removeStopWords(topKWords) {
  // Remove stop words
  return topKWords
    .filter((word) => !STOPWORDS.includes(word[0]))
    .map((wordArr) => {
      return { normal: wordArr[0], count: wordArr[1] };
    });
}
