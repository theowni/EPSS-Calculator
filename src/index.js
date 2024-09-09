import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import './index.css';
import GitHubForkRibbon from 'react-github-fork-ribbon';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider>
    <GitHubForkRibbon
      href="https://github.com/theowni/EPSS-Calculator"
      target="_blank"
      position="right">
      Available on GitHub
    </GitHubForkRibbon>
    <App />
  </ChakraProvider>,
);
