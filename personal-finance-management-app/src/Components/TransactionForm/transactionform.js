
import React, { useEffect, useState } from 'react';

import '../../assets/styles/transactionform.css';
import {  useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import moment from 'moment';

const fetchTransactionById = gql`
  query fetchTransactionById($itemId: ID){
    transaction(itemId:$itemId) {
      itemId
      description
      category
      amount
      date
          }
  }
`;

const addNewTransaction = gql`
        mutation addNewTransaction($category: String!, $description: String!, $amount: String!, $date: String!) {
        addTransaction(
        category: $category,
         description: $description, 
         amount: $amount, 
         date: $date)
}`

const updateTransactionById = gql`
mutation UpdateTransaction($itemId: ID!, $category: String!, $description: String!, $amount: String!, $date: String!) {
  updateTransaction(
  itemId: $itemId,
   category: $category, 
   description: $description, 
   amount: $amount, 
   date:$date
   )
}
`


const TransactionForm = () => {
    const { id } = useParams();
    const { data, error, loading } = useQuery(fetchTransactionById, { variables: { itemId: id },skip:!id },)
    const [addTransaction] = useMutation(addNewTransaction);
    const [updateTransaction] = useMutation(updateTransactionById);


    const navigate = useNavigate();

    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [errorMsg, setErrorMsg] = useState();


    const saveButtonClicked = async () => {
        try {
            
            if (id) {
                 await updateTransaction({ variables: { itemId: id, description: description, category: category, amount: amount, date: moment().format('YYYY-MM-DD') } }).then(() => {
                    navigate('/transactionlist');});
              
                
            } else {
                await addTransaction({
                    variables: {
                        category: category,
                        description: description,
                        amount: amount,
                        date: moment().format('YYYY-MM-DD')
                    }
                }).then(() => {
                    navigate('/dashboard');});
                
            }
        } catch (e) {
            console.error("Error occurred during mutation:", e);
            if (e.networkError) {
                console.error("Network error details:", e.networkError);
            }
            if (e.graphQLErrors) {
                e.graphQLErrors.forEach(({ message, locations, path }) => {
                    console.error(`GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`);
                });
            }
        }
    };
    
    
    useEffect(() => {
        
        
        if (data && data.transaction) {
            setDescription(data.transaction.description);
            setCategory(data.transaction.category);
            setAmount(data.transaction.amount);
        }
       
    }, [data]);

    // useEffect(() => { refetch() }, [refetch])



    if (loading) {
        return <div>loading...</div>
    }
    if (error) {



        return <div>error...</div>
    }


    return (
        <div className="transaction-form-page">

            <div className="transaction-form-container">

                <h1>Transaction Form</h1>

                <form className="transaction-form">
                    <div className="form-group">
                        <label>Description:</label>
                        <input value={description} type="text" onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="category-dropdown"
                        >
                            <option value="">Select category</option>
                            <option value="income">Income</option>
                            <option value="expenses">Expenses</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Amount:</label>
                        <input value={amount} type="number" onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
                    </div>
                    {(errorMsg !== '') &&
                        <label style={{ color: "red" }}>{errorMsg}</label>
                    }

                    <div className="button-group">
                        <button type="button" onClick={ saveButtonClicked}>Save</button>
                        <button type="button" onClick={() => id ? navigate('/transactionlist') : navigate('/dashboard')}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
