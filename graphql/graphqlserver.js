const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
const { default: axios } = require("axios");

const baseURL = 'http://localhost:3002';

let typeDefs = `
type User {
        userId: ID!
        name: String!
        email: String!
        password: String!
        token: String!
    }

    type Transaction {
        itemId: ID!
        userId: ID!
        category: String!
        description: String!
        amount: String!
        date: String!
    }

    type Query {
        allTransactions: [Transaction]
        transaction(itemId: ID): Transaction
    }

    type Mutation {
        login(username: String!, password: String!): String
        register(username: String!, password: String!, email: String!): String

        addTransaction(category: String!, description: String!, amount: String!, date: String!): String
        updateTransaction(itemId: ID! , category: String!, description: String!, amount: String!, date: String!): String
        deleteTransaction(itemId: ID): String
    }   

`
;

let resolvers = {
    Query: {
       
        async allTransactions(_, __, contextValue) {
            
            let result = await axios.get(baseURL + '/items', {
    
                headers: { Authorization: `Bearer ${contextValue.token}`}
                
            })
            
            return result.data.data
        },

        async transaction(src, { itemId },contextValue) {
            let result = await axios.get(baseURL + '/items/' + itemId, {
    
                headers: { Authorization: `Bearer ${contextValue.token}`}
                
            })
            return result.data
        }
    },
    Mutation: {
        async login(src, { ...userData }) {
            
            let result = await axios.post(baseURL + '/login', userData, )
            return result.data.token
        },

        async register(src, { ...userData }) {
            let result = await axios.post(baseURL + '/users', userData)
            return result.data.userId
        },

        async addTransaction(src, { ...itemData },contextValue) {
            let result = await axios.post(baseURL + '/items', itemData, {
    
                headers: { Authorization: `Bearer ${contextValue.token}`}
                
            })
            return result.data.userId
        },

        async updateTransaction(src, { itemId, ...itemData },contextValue) {
            let result = await axios.put(baseURL + '/items/' + itemId, itemData, {
    
                headers: { Authorization: `Bearer ${contextValue.token}`}
                
            })
            return result.data.userId
        },

        async deleteTransaction(src, { itemId },contextValue) {
            await axios.delete(baseURL + '/items/' + itemId, {
    
                headers: { Authorization: `Bearer ${contextValue.token}`}
                
            })
        }
    }
};

let server = new ApolloServer({
    typeDefs,
    resolvers
   
});
startStandaloneServer(server, {
    listen: 9000,
    context: async ({ req }) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("No authorization header found");
            return { token: null };
        }

        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            console.log("Invalid authorization header format");
            return { token: null };
        }

        const token = parts[1];
        return { token };
    }
}).then(response => console.log("GraphQL server started at 9000"));