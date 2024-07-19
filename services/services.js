const {
    queryAllTransactions,
  } = require("../models/models");
  
  const projectedFutureSavings = (transaction) => {
    const currentDate = new Date();
    const endDate = new Date(transaction.date);
    const monthsRemaining =
      (endDate.getFullYear() - currentDate.getFullYear()) * 12 +
      (endDate.getMonth() - currentDate.getMonth());
    const projectedSavings =
      transaction.bank_value +
      (transaction.monthly_income - transaction.monthly_spending) *
        monthsRemaining;
    return projectedSavings >= transaction.desired_goal;
  };
  
  export const transactions = (results) => {
    const results = queryAllTransactions();
    if (results instanceof Error) {
      console.error("Error fetching transactions:", err);
      return results;
    } else {
      return results.map((transaction) => ({
        ...transaction,
        goalAchieved:
          projectedFutureSavings(transaction) >= transaction.desired_goal,
      }));
    }
  };
  