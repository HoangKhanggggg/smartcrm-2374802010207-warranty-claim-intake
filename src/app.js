require('dotenv').config();
const express = require('express');
const { migrate } = require('./db');

migrate();
const app = express();
app.use(express.json());
app.use('/tickets', require('./routes/tickets'));

if (require.main === module)
  app.listen(process.env.PORT || 3000, () => console.log('Chạy tại cổng', process.env.PORT || 3000));
module.exports = app;