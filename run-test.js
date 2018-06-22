const exec = require('child_process').exec;
const output = [];
const fs = require("fs");

const child = exec('git diff --name-only HEAD~5 HEAD | grep spec',
  (error, stdout, stderr) => {
    var fileList = stdout.trim().split("\n");
    console.log(fileList);
    var j = 0;
    for (var i = 0; i < fileList.length; i++) {
      setTimeout(function () {
        console.log(fileList, j)
        if (fs.existsSync(fileList[j])) {
          runTest(fileList[j]);
        }
        j++;
      }, i * 5000);
    }
    setTimeout(() => {exit()}, fileList.length * 5000);
  });

function runTest(fileName) {
  const test = exec('npm run jest--no-watch -- ' + fileName,
    (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
      if (error) {
        output.push(error);
      }
    }
  );
}

function exit() {
  if (output.length > 0) {
    console.error("ERR: ", "\033[31m" + output)
    process.exit(1)
  }

  process.exit(0);
}