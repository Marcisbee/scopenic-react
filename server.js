const fs = require('fs');
const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  const filePath = path.resolve(__dirname, `dist/${req.url}`);

  try {
    if (req.url !== '/' && fs.existsSync(filePath)) {
      res.sendFile(filePath);
      return;
    }
  } catch (e) {}

  const indexPath = path.resolve(__dirname, 'dist/index.html');
  res.sendFile(indexPath);
});

app.listen(port);
