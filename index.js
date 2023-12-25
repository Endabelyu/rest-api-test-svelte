const express = require('express');

const app = express();
const port = 3030;

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.send('belajar membangun Web CRUD di nodejs mysql')
);

app.listen(port, () => console.log(`App listening to port ${port}`));
