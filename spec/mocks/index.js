'use babel';

import fs from 'fs';
import readline from 'readline';

export const ValidMarkdown = () => (
  fs.readFileSync(__dirname + '/valid-markdown.md', 'utf8', (err, data) => {
    if (err) throw err;
    return data;
  })
);

export const validMarkdownLineReader = readline.createInterface({
  input: fs.createReadStream(`${__dirname}/valid-markdown.md`)
});
