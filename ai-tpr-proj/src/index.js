import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from "@chakra-ui/react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ChatMain from './components/chatBody';
import Register from './page/register';
import LoginPage from './page/login';



const router = createBrowserRouter([
  
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/chats/:id",
    element: <App />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/signin",
    element: <LoginPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <ChakraProvider>
  
  <React.StrictMode>
  <RouterProvider router={router} />
    
  </React.StrictMode>
  
   </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
