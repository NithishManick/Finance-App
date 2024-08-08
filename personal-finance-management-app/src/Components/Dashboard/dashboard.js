import { useEffect, useState } from 'react';
import '../../assets/styles/dashboard.css';
import { gql, useQuery } from '@apollo/client';

const allTransactionsQuery = gql`
  query allTransactionsQuery {
    allTransactions {
      itemId
      category
      description
      amount
    }
  }
`;

const Dashboard = () => {
  const { data, error, loading, refetch } = useQuery(allTransactionsQuery);
  const [originalTransactions, setOriginalTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [descriptionList, setDescriptionList] = useState([]);
  const [activeDescription, setActiveDescription] = useState(null);

  const searchValueChange = (event) => {
    let val = event.target.value;
    setSearch(val);
  };

  const handleDescriptionClick = (description) => {
    setSearch(description);
    setActiveDescription(description);
  };

  useEffect(() => {
    if (search === "" || search === null) {
      setTransactions(originalTransactions);
    } else {
      const filteredTransactions = originalTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(search.toLowerCase())
      );
      setTransactions(filteredTransactions);
    }
  }, [search, originalTransactions]);

  useEffect(() => {
    if (originalTransactions.length > 0) {
      const descriptionList = [...new Set(originalTransactions.map((t) => t.description))];
      setDescriptionList(descriptionList);

      const incomeList = originalTransactions.filter(
        (f) => f.category && f.category.toLowerCase() === 'income'
      );
      const incomeSum = incomeList.reduce((total, income) => total + income.amount, 0);
      setTotalIncome(incomeSum);

      const expensesList = originalTransactions.filter(
        (f) => f.category && f.category.toLowerCase() === 'expenses'
      );
      const expensesSum = expensesList.reduce((total, expense) => total + expense.amount, 0);
      setTotalExpense(expensesSum);

      const balance = incomeSum - expensesSum;
      setBalance(balance);
    }
  }, [originalTransactions]);

  useEffect(() => {
    if (data && data.allTransactions) {
      const parsedTransactions = data.allTransactions.map((transaction) => ({
        ...transaction,
        amount: parseFloat(transaction.amount),
      }));
      setOriginalTransactions(parsedTransactions);
      setTransactions(parsedTransactions);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    
    return <div>error...</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Finance Dashboard</h1>
        <div className="summary">
          <div className="summary-item">
            <label>Total Balance:</label>
            <span>${balance}</span>
          </div>
          <div className="summary-item">
            <label>Income:</label>
            <span>${totalIncome}</span>
          </div>
          <div className="summary-item">
            <label>Expenses:</label>
            <span>${totalExpense}</span>
          </div>
        </div>
        <div className="categories">
          <div className="categories-item">
            <label>Categories:</label>
            {descriptionList.map((description) => (
              <button key={description} onClick={() => handleDescriptionClick(description)} className={`description-item ${activeDescription === description ? 'active' : ''}`}>
                {description}
              </button>
            ))}
          </div>
        </div>
        <div className="transaction-list">
          <div className="align-button">
            <h1>Transaction Lists</h1>
            <input type="text" value={search} onFocus={(e) => e.target.select()} onChange={searchValueChange} placeholder="Search transactions..." className="search-bar" />
          </div>
          <div className="transaction-grid">
            {transactions.length === 0 ? (
              <h1 style={{ justifyContent: "center", marginLeft: "500px", whiteSpace: "nowrap" }}>No Match Found</h1>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.itemId} className="transaction-card">
                  <h2>Transaction {transaction.itemId}</h2>
                  <p>Description: {transaction.description}</p>
                  <p>Amount: ${transaction.amount}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;