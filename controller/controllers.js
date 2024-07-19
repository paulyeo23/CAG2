const {
    queryAllTransactions,
    insertTransaction,
    querySingleTransaction,
    editTransaction,
    deleteTransaction,
  } = require("../models/models");
  
  const { transactions } = require("../services/services");
  
  const getAllTransactions = async () => {
    const results = transactions();
    if (results instanceof Error) {
      console.error("Error fetching transactions:", err);
      return results;
    } else {
      res.render("index", { results });
    }
  };
  
  module.exports = {
    getAllTransactions,
  };
  