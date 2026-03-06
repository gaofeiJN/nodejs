const fs = require("node:fs");
const path = require("path");

console.time("read");
const filepath = path.resolve(__dirname, "readme.txt");
console.log(filepath);

fs.readFile(filepath, () => {
  console.timeEnd("read");
});
