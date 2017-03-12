'use babel';

export const isBlankLine = line => (
  line === ''
);

export const isHeader = (line, index) => (
  line[0] === '#' && line.indexOf('# ') !== -1
);

export const isCodeBlock = line => (
  line.slice(0, 3) === '```'
);

export const isListItem = (line) => {
  const regex = /^\ *([0-9]*\.|\*|\-|\+)\ /;
  return regex.test(line);
};

export const isLinkDef = (line) => {
  const regex = /^\[.*\]:\ /;
  return regex.test(line);
}

export const isTable = (line) => {
  const regex = /^\|\ .*\ \|$/;
  return regex.test(line);
};
