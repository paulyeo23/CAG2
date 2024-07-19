const mysql = require("mysql2");

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "financial_tracker",
});

const queryAllTransactions = async () => {
  const query = "SELECT * FROM transactions";
  return await db.query(query, (err, results) => {
    if (err) {
      return err;
    }
    return results;
  });
};

const insertTransaction = async (transaction) => {
  const query =
    "INSERT INTO transactions (name, bank_value, monthly_income, monthly_spending, desired_goal, date) VALUES (?, ?, ?, ?, ?, ?)";
  return await db.query(query, transaction, (err, results) => {
    if (err) {
      return err;
    }
    return results;
  });
};

const querySingleTransaction = async (id) => {
  const query = "SELECT * FROM transactions WHERE id = ?";
  return await db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching transaction:", err);
      res.status(500).send("Internal Server Error");
      return err;
    }
    return results;
  });
};

const editTransaction = async (transactionWithId) => {
  const query =
    "UPDATE transactions SET name = ?, bank_value = ?, monthly_income = ?, monthly_spending = ?, desired_goal = ?, date = ? WHERE id = ?";
  db.query(query, transactionWithId, (err, results) => {
    if (err) {
      return err;
    }
    return results;
  });
};

const deleteTransaction = async (id) => {
  const query = "DELETE FROM transactions WHERE id = ?";
  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.redirect("/");
  });
};

module.exports = {
  queryAllTransactions,
  insertTransaction,
  querySingleTransaction,
  editTransaction,
  deleteTransaction,
};
