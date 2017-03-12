'use babel';

import * as Helpers from './helpers';

const reflowText = (lines) => {
  const getType = (line, oldType) => {
    const isCodeBlock = Helpers.isCodeBlock(line);
    if (oldType === 'text' && Helpers.isHeader(line)) {
      return 'header';
    } else if (isCodeBlock && oldType !== 'codeBlock') {
      return 'codeBlock';
    } else if (isCodeBlock) {
      return 'text';
    } else if (oldType === 'codeBlock') {
      return 'codeBlock';
    } else {
      return 'text';
    }
  }

  const getSplitLength = (line) => {
    let splitLength = 72;
    while (line[splitLength] !== ' ') {
      splitLength -= 1;
      if (splitLength === 0) return line.length;
    }
    return splitLength;
  }

  const getRemainders = (line, index) => {
    if (line.length <= 72) return [line];
    const splitLength = getSplitLength(line);
    const first = line.slice(0, splitLength);
    const second = line.slice(splitLength + 1);
    if (Helpers.isBlankLine(second)) {
      return [first];
    } else {
      return [first].concat(getRemainders(second));
    }
  }

  let currentLineType = 'text';
  let newText = [];
  let spillOver = '';

  lines.forEach((line) => {
    console.log(Helpers.isListItem(line));
    currentLineType = getType(line, currentLineType);
    if (currentLineType === 'text') {
      if ((!Helpers.isBlankLine(spillOver) && Helpers.isBlankLine(line)) || Helpers.isListItem(line) && !Helpers.isBlankLine(spillOver)) {
        newText.push(spillOver);
      } else {
        line = spillOver + line;
      }
      spillOver = '';
      let remainders = getRemainders(line);
      if (remainders.length > 1) {
        const lastIndex = remainders.length - 1;
        spillOver = `${remainders[lastIndex]} `;
        remainders = remainders.slice(0, lastIndex);
      }
      remainders.forEach(remainder => newText.push(remainder));
    } else if (Helpers.isBlankLine(spillOver)){
      newText.push(line);
    } else {
      newText.push(spillOver, line);
      spillOver = '';
    }
  });

  if (!Helpers.isBlankLine(spillOver)) {
    newText.push(spillOver);
  }

  return newText.join('\n');
};

export default reflowText;
