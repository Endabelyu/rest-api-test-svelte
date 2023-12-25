const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'db_test_svelte',
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error('Error reconnecting to the database:', err);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports = connection;
