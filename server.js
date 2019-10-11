const fs = require('fs');
const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  const filePath = path.resolve(__dirname, `build/${req.url}`);

  try {
    if (req.url !== '/' && fs.existsSync(filePath)) {
      res.sendFile(filePath);
      return;
    }
  } catch (e) {}

  const indexPath = path.resolve(__dirname, 'build/index.html');
  res.sendFile(indexPath);
});

app.listen(port);
