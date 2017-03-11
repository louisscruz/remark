'use babel';

export const isHeader = (line, index) => (
  line[0] === '#' && line.indexOf('# ') !== -1
);

export const isCodeBlock = line => (
  line.slice(0, 3) === '```'
);

export const isListItem = (line, index) => {
  return false;
};

export const isBlockQuote = (line) => {
  return false;
};

export const isTable = (line, index) => {
  return false;
};
