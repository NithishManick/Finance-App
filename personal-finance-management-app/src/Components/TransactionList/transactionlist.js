
import { useEffect, useState } from "react";
import "../../assets/styles/transactionlist.css";
import { useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";

const allTransactionsQuery = gql`
  query allTransactionsQuery{
    allTransactions {
      itemId
      userId
      description
      category
      amount
      date
    }
  }
`;

const deleteTransactionQuery = gql`
    mutation deleteTransactionQuery($itemId: ID) {
  deleteTransaction(itemId: $itemId)
}
`


const TransactionList = () => {
    const { data, error, loading,refetch } = useQuery(allTransactionsQuery)
    const [deleteTransaction] = useMutation(deleteTransactionQuery);
    const options = [
        { label: 'Filter by Category', value: 'Filter by Category' },
        { label: 'Income', value: 'Income' },
        { label: 'Expenses', value: 'Expenses' },
    ];

    const [originalTransactions, setOriginalTransactions] = useState([])
    const [categoryFiltertransactions, setCategoryFilterTransactions] = useState([]);
    const [searchFiltertransactions, setSearchFilterTransactions] = useState([]);

    const [value, setValue] = useState('Filter by Category');
    const [search, setSearch] = useState('');
    const [showModal, setshowModal] = useState(false);
    const navigate = useNavigate();
    const [selectedTransaction, setSelectedTransaction] = useState(null)

    const showModalView = (transaction) => {
        setSelectedTransaction(transaction)
        setshowModal(true)
    }
    const closeModalView = () => {
        setshowModal(false)
        setSelectedTransaction(null)
    }

    const dropDownValueChange = (event) => {

        let val = event.target.value
        setValue(val);
        setSearch('')

    };

    const searchValueChange = (event) => {
        let val = event.target.value;
        setSearch(val);
    }

    const deleteButtonClicked = async (itemToBeDeletedId) => {
        console.log(itemToBeDeletedId);
        
        try { 
            await deleteTransaction({ variables: { itemId: itemToBeDeletedId } });
            refetch();
            
         } catch (e) {
                      
           console.error(e) ;
          }
    }
    useEffect(() => {
        if (search === "" || search === null) {
            setSearchFilterTransactions(categoryFiltertransactions);
        } else {
            const filteredTransactions = categoryFiltertransactions.filter(transaction =>
                transaction.description.toLowerCase().includes(search.toLowerCase())
            );
            setSearchFilterTransactions(filteredTransactions);
        }
    }, [search, categoryFiltertransactions]);

    useEffect(() => {
        if (value === "Filter by Category") {
            setCategoryFilterTransactions(originalTransactions);
        } else {
            const filteredTransactions = originalTransactions.filter(transaction =>
                transaction.category.toLowerCase() === value.toLowerCase()
            );
            setCategoryFilterTransactions(filteredTransactions);
            setSearchFilterTransactions(filteredTransactions);
        }
    }, [value, originalTransactions]);
    useEffect(() => {



        if (data && data.allTransactions) {
            setOriginalTransactions(data.allTransactions);
            setCategoryFilterTransactions(data.allTransactions)
            setSearchFilterTransactions(data.allTransactions)
            
        }
        
    }, [data]);


    useEffect(()=>{refetch()},[refetch])


    if (loading) {
        return <div>loading...</div>
    }
    if (error) {


        return <div>error...</div>
    }



    return (
        <div className="transaction-list-page">
            <h1>Transaction List</h1>
            <div className="search-filter-container">
                <input value={search} type="text" onChange={searchValueChange} placeholder="Search transactions..." className="search-bar" />
                <select value={value} onChange={dropDownValueChange} className="filter-dropdown">
                    {options.map((option, index) => (
                        <option key={index} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="grid">
                {searchFiltertransactions.length === 0 ? <h1 style={{ justifyContent: "center", marginLeft: "500px", whiteSpace: "nowrap" }}>No Match Found</h1> : searchFiltertransactions.map((transaction, ind) => (
                    <div key={transaction.itemId} className="card">
                        <h2>Transaction {transaction.itemId}</h2>
                        <p>Description: {transaction.description}</p>
                        <p>Category: {transaction.category}</p>
                        <p>Amount: ${transaction.amount}</p>
                        <p>Date: {transaction.date}</p>
                        <div className="buttons">

                            <button type="button" key={transaction.itemId} onClick={() => showModalView(transaction)}>View Detail</button>
                            <button type="button" onClick={() => navigate(`/transactionform/${transaction.itemId}`,)}>Edit</button>
                            <button type="button" onClick={()=>deleteButtonClicked(transaction.itemId)}>Delete</button>
                        </div>



                    </div>
                ))}
            </div>
            {showModal && selectedTransaction && (
                <div className="main">
                    <div className="popup">
                        <h2>Transaction Details</h2>
                        <div key={selectedTransaction.id}>
                            <h3>Transaction {selectedTransaction.itemId}</h3>
                            <p>Description: {selectedTransaction.description}</p>
                            <p>Category: {selectedTransaction.category}</p>
                            <p>Amount: ${selectedTransaction.amount}</p>
                            <p>Date: {selectedTransaction.date}</p>
                            <button className="closebutton" onClick={closeModalView}>Close</button>
                        </div>

                    </div>

                </div>)}

        </div>

    );
}

export default TransactionList;
