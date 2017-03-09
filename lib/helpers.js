'use babel';

export const reflowText = (lines) => {
  const newLines = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    newLines.push(line.slice(0, 72));
  }

  const newText = newLines.join('\n');
  return newText;
};
