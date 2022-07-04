const express = require('express');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());



app.listen(8080, () => {
  console.log('Server started on port 8080; press Ctrl-C to terminate...');
});