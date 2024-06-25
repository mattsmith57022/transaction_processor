const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

app.use(cors());

const pool = new Pool({
  user: 'versapay',
  host: 'localhost',
  database: 'versapay',
  password: 'versapay',
  port: 5432,
});

app.get('/api/branches', async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const offset = (page - 1) * limit;

  try {
    const dataQuery = {
      text: 'SELECT * FROM branch_statistics ORDER BY branch_code LIMIT $1 OFFSET $2',
      values: [limit, offset],
    };
    const countQuery = 'SELECT COUNT(*) FROM branch_statistics';

    const dataResult = await pool.query(dataQuery);
    const countResult = await pool.query(countQuery);

    const totalItems = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      data: dataResult.rows,
      pageInfo: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalItems,
        totalPages: totalPages
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/top-branches', async (req, res) => {
  try {
      const query = {
          text: 'SELECT * FROM branch_statistics ORDER BY avg_amount DESC LIMIT 10'
      };
      const result = await pool.query(query);
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/branches/:branchCode', async (req, res) => {
  const branchCode = req.params.branchCode;
  try {
      const query = {
          text: 'SELECT * FROM branch_statistics WHERE branch_code = $1',
          values: [branchCode]
      };
      const result = await pool.query(query);
      if (result.rows.length > 0) {
          res.json(result.rows[0]);
      } else {
          res.status(404).json({ message: 'Branch not found' });
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
