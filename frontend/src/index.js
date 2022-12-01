import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThirdwebProvider desiredChainId={ChainId.Polygon}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThirdwebProvider>
);

//reportWebVitals();

// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import { BrowserRouter } from "react-router-dom";
// import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

// ReactDOM.render(
//   <ThirdwebProvider desiredChainId={ChainId.Mumbai}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </ThirdwebProvider>,
//   document.getElementById('root')
// );



