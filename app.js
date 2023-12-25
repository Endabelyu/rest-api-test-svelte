const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;
const uuid = require('uuid');
const cors = require('cors');
// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Enable CORS for all routes
app.use(cors());
// create data / insert data
app.post('/api/candidate', (req, res) => {
  const data = { ...req.body, candidate_id: uuid.v4() };

  connection.query('INSERT INTO tb_candidate SET ?', data, (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to insert data!',
        error: err,
      });
    }

    console.log('Insert successful! Inserted ID:', data.candidate_id);
    res
      .status(201)
      .json({ success: true, message: 'Berhasil insert data!', data: data });
  });
});

// read data / get data
app.get('/api/candidate', (req, res) => {
  const querySql = 'SELECT * FROM tb_candidate';

  connection.query(querySql, (err, rows, field) => {
    // error handling
    if (err) {
      return res
        .status(500)
        .json({ message: 'failed to get candidate data', error: err });
    }

    res.status(200).json({ success: true, data: rows });
  });
});
// read data / get data spesific user
app.get('/api/candidate/:id', (req, res) => {
  console.log(req.params);
  const querySql = `SELECT * FROM tb_candidate WHERE candidate_id = "${req.params.id}"`;

  connection.query(querySql, (err, rows, field) => {
    // error handling
    if (err) {
      return res
        .status(500)
        .json({ message: 'failed to get candidate data', error: err });
    }

    res.status(200).json({ success: true, data: rows });
  });
});

// update data
app.put('/api/candidate/:id', (req, res) => {
  // buat variabel penampung data dan query sql
  const data = { ...req.body };
  const querySearch = `SELECT * FROM tb_candidate WHERE candidate_id = "${req.params.id}"`;
  const queryUpdate = `UPDATE tb_candidate SET ? WHERE candidate_id = "${req.params.id}"`;

  // run query to get data by id
  connection.query(querySearch, req.params.id, (err, rows, field) => {
    // error handling
    if (err) {
      return res
        .status(500)
        .json({ message: 'Failed to get data candidate', error: err });
    }

    if (rows.length) {
      // run query update
      connection.query(
        queryUpdate,
        [data, req.params.id],
        (err, rows, field) => {
          // error handling
          if (err) {
            return res
              .status(500)
              .json({ message: 'Failed to update data candidate', error: err });
          }

          // if update successfully
          res.status(200).json({
            success: true,
            message: 'Data updated successfully!',
            data: rows,
          });
        }
      );
    } else {
      return res
        .status(404)
        .json({ message: 'Data Not Found', success: false });
    }
  });
});

// delete data
app.delete('/api/candidate/:id', (req, res) => {
  // create query to delete data
  const querySearch = `SELECT * FROM tb_candidate WHERE candidate_id = "${req.params.id}"`;
  const queryDelete = `DELETE FROM tb_candidate WHERE candidate_id = "${req.params.id}"`;

  // run data to find data
  connection.query(querySearch, req.params.id, (err, rows, field) => {
    // error handling
    if (err) {
      return res
        .status(500)
        .json({ message: 'Failed to get data', error: err });
    }

    if (rows.length) {
      // run query delete
      connection.query(queryDelete, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
          return res
            .status(500)
            .json({ message: 'Failed to delete data', error: err });
        }

        // id data successfully  deleted
        res
          .status(200)
          .json({ success: true, message: 'Data successfully deleted!' });
      });
    } else {
      return res
        .status(404)
        .json({ message: 'Data not found!', success: false });
    }
  });
});

// create server nya
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
