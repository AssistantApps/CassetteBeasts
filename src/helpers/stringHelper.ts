import { chineseLocale, japaneseLocale, koreanLocale } from 'constants/localisation';

const capitalizeAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const capitalizeFirstLetter = (orig: string) => {
  if (orig.length == 0) return orig;
  return [orig[0].toUpperCase(), ...orig.slice(1, orig.length)].join('');
};

export const lowercaseFirstLetter = (orig: string) => {
  if (orig.length == 0) return orig;
  return [orig[0].toLowerCase(), ...orig.slice(1, orig.length)].join('');
};

export const addSpacesForEnum = (orig: string) => {
  if (orig.length == 0) return orig;
  let result = '';

  for (const char of orig) {
    if (capitalizeAlphabet.includes(char)) {
      result += ' ';
    }
    result += char;
  }
  return result;
};

export const stringStartsWith = (textToMatch: string, line: string): boolean => {
  let matches = true;
  for (let charIndex = 0; charIndex < textToMatch.length; charIndex++) {
    const char = textToMatch[charIndex];

    if (line.charAt(charIndex) != char) {
      matches = false;
      break;
    }
  }
  return matches;
};

export const stringToBool = (text: string): boolean => {
  if (text == null || text.length < 1) return false;
  const trimmed = text.trim();
  return trimmed == 'true' || trimmed == '"true"' || trimmed == '1';
};

export const stringToBoolWithDefault = (text: string, defaultValue: boolean): boolean => {
  if (text == null || text.length < 1) return defaultValue;
  if (text.includes('undefined')) return defaultValue;
  return stringToBool(text);
};

export const stringToParent = (parentStrRaw: string): string => {
  return (parentStrRaw ?? '')
    .replace('NodePath("../', '')
    .replace('NodePath(".")', '')
    .replace('")', '')
    .replace('undefined', '')
    .trim();
};

export const getCleanedString = (line: string): string => {
  if (line == null || line.length < 1) return '';
  const trimmed = line.trim();
  let noQuotes = trimmed;
  if (noQuotes.length >= 2) {
    noQuotes = trimmed.substring(1, trimmed.length - 1);
  }
  return noQuotes;
};

export const getStringArray = (line: string): Array<string> =>
  (line ?? '')
    .replace('[', '')
    .replace(']', '')
    .split(', ')
    .map(getCleanedString)
    .filter((l) => l != null && l.length > 0);

export const pad = (num: number, size: number, char: string = '0'): string => {
  let s = num + '';
  while (s.length < size) s = char + s;
  return s;
};

export const resAndTresTrim = (line: string): string => {
  if (line == null || line.length < 1) return '';

  const lastSlashIndex = line.lastIndexOf('/');
  const lastDotIndex = line.lastIndexOf('.');
  const value = line.substring(lastSlashIndex + 1, lastDotIndex);

  return value.trim();
};

export const limitLengthWithEllipse = (line: string, limit: number): string => {
  if (line == null || line.length < 1) return '';
  if (line.length < limit) return line;
  return line.substring(0, limit) + '...';
};

export const stars = (amount: number): string => {
  if (isNaN(amount)) return '';
  return '★'.repeat(amount + 1);
};

export const encodeEmail = (email: string) => {
  const chars = (email ?? '').toString().split('');
  return encodeURI(btoa(chars.map((c) => `<${c}>`).join('')));
};

export const getDescripLines = (langCode: string, description: string) => {
  let charsPerLine = 80;
  let wordSplitChar = ' ';
  if (langCode == chineseLocale) {
    charsPerLine = 25;
    wordSplitChar = '';
  }
  if (langCode == japaneseLocale) {
    charsPerLine = 25;
    wordSplitChar = '';
  }
  if (langCode == koreanLocale) {
    charsPerLine = 35;
  }

  let descriptionLines = [];
  if (description.length > charsPerLine) {
    const words = description.split(wordSplitChar);
    let charCount = 0;
    let totalCharCount = 0;
    let lastLineLength = 0;
    for (const word of words) {
      charCount = charCount + word.length + 1;
      totalCharCount = totalCharCount + word.length + 1;

      if (charCount > charsPerLine) {
        const newLine = description.substring(totalCharCount - charCount, totalCharCount);
        descriptionLines.push(newLine);
        lastLineLength = lastLineLength + newLine.length;
        charCount = 0;
      }
    }

    if (totalCharCount < description.length + 2) {
      descriptionLines.push(description.substring(lastLineLength, description.length));
    }
  } else {
    descriptionLines.push(description);
  }

  if (descriptionLines.length > 3 && descriptionLines[3].length > 0) {
    descriptionLines = descriptionLines.slice(0, 3);
    descriptionLines[2] = descriptionLines[2].substring(0, charsPerLine / 2) + '...';
  }

  return descriptionLines;
};
