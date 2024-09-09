import { ChakraProvider } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './tailwind.css';
import { HashRouter as Router } from "react-router-dom";


const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Router>
  <StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </StrictMode>
  </Router>
);
