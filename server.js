const fs = require('fs');
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();

// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {

  console.log({ req });

  if (req.url === '/ping') {
    res.send('I\'m alive');
    return;
  }

  const filePath = `build/${req.url}`;

  try {
    if (req.url !== '/' && fs.existsSync(filePath)) {
      res.sendFile(filePath);
      return;
    }
  } catch (e) {}

  const indexPath = 'build/index.html';
  res.sendFile(indexPath);
});

app.listen(port);

console.log('App running on', `localhost:${port}`);
