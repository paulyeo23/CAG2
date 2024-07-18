const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();

const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'financial_tracker'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Helper function to calculate if the goal is achieved
function isGoalAchieved(transaction) {
    const currentDate = new Date();
    const endDate = new Date(transaction.date);
    const monthsRemaining = (endDate.getFullYear() - currentDate.getFullYear()) * 12 + (endDate.getMonth() - currentDate.getMonth());
    const projectedSavings = transaction.bank_value + (transaction.monthly_income - transaction.monthly_spending) * monthsRemaining;
    return projectedSavings >= transaction.desired_goal;
}

// Routes
app.get('/', (req, res) => {
    const query = 'SELECT * FROM transactions';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        const transactions = results.map(transaction => ({
            ...transaction,
            goalAchieved: isGoalAchieved(transaction)
        }));
        res.render('index', { transactions });
    });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const { name, bank_value, monthly_income, monthly_spending, desired_goal, date } = req.body;
    const query = 'INSERT INTO transactions (name, bank_value, monthly_income, monthly_spending, desired_goal, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, bank_value, monthly_income, monthly_spending, desired_goal, date], (err) => {
        if (err) {
            console.error('Error adding transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
});

app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM transactions WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('edit', { transaction: results[0] });
    });
});

app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, bank_value, monthly_income, monthly_spending, desired_goal, date } = req.body;
    const query = 'UPDATE transactions SET name = ?, bank_value = ?, monthly_income = ?, monthly_spending = ?, desired_goal = ?, date = ? WHERE id = ?';
    db.query(query, [name, bank_value, monthly_income, monthly_spending, desired_goal, date, id], (err) => {
        if (err) {
            console.error('Error updating transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
});

app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM transactions WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.redirect('/');
    });
});

app.get('/financials', (req, res) => {
    res.render('financial');
});

app.post('/financials', (req, res) => {
    const { bankValue, monthlyIncome, monthlySpending, yearEndGoal } = req.body;
    const monthlySavings = monthlyIncome - monthlySpending;
    const estimatedEndOfYear = bankValue + (monthlySavings * 12);
    const goalAchieved = estimatedEndOfYear >= yearEndGoal;

    res.render('result', { bankValue, monthlyIncome, monthlySpending, yearEndGoal, goalAchieved });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
