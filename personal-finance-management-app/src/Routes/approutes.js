import { createBrowserRouter, Link, Navigate } from "react-router-dom";
import ProtectedRoutes from "./protectedroutes";
import PublicRoutes from "./publicroutes";
import LoginForm from "../Components/Login/login";
import Dashboard from "../Components/Dashboard/dashboard";
import MainLayout from "../layouts/mainlayout";
import TransactionList from "../Components/TransactionList/transactionlist";
import TransactionForm from "../Components/TransactionForm/transactionform";
import Register from "../Components/Register/register";

const AppRoutes = createBrowserRouter([
    {
        path: '/',
        element: <PublicRoutes/>,
        children: [
          {
            index: true,
            element: <Navigate to="/login"  />
        },
        {
            path: '/login',
            element: <LoginForm/>
        },
            {
                path: '/register',
                element: <Register />,
              },
              
            {
                path: '/unauthorizedaccess',
                element: (<div>
                            <h1>You are not authorized to view. Please Login </h1>
                            <LoginForm/>
                        </div>)
            }
        ]
    },
    {
        path: '/',
        element: <ProtectedRoutes/>,
        children: [
           
            {
                path: '/',
                element: <MainLayout />,
                children: [
                  {
                    path: '/dashboard',
                    element: <Dashboard />,
                  },
                  {
                    path: '/transactionlist',
                    element: <TransactionList />,
                  },
                  {
                    path: '/transactionform/:id',
                    element: <TransactionForm />,
                  },
                  {
                    path: '/transactionform',
                    element: <TransactionForm />,
                  },
                ],
              },
        ]
    }
]);

export default AppRoutes;