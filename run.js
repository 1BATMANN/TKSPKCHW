const express = require("express");
const { config } = require('dotenv');

config();

const app = express();
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bot Status</title>
      </head>
      <body style="text-align: center; padding: 20px;">
        <h1>server on</h1>
      </body>
    </html>
  `);
});

const { exec } = require('child_process');


function runScript(scriptName) {
  const command = `node ${scriptName}.js`;

  const childProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${scriptName}: ${error}`);
      return;
    }

    console.log(`${scriptName} output:\n${stdout}`);
  });

  childProcess.stdout.on('data', (data) => {
    console.log(`${scriptName} stdout: ${data}`);
  });

  childProcess.stderr.on('data', (data) => {
    console.error(`${scriptName} stderr: ${data}`);
  });
}


