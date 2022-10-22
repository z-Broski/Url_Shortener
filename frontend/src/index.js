import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UrlStats from './UrlStats';
import reportWebVitals from './reportWebVitals';
import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path=":shortUrl" element={<UrlStats />} />
      <Route path="*" element={<div className='App'><h2>404 - Short url not found</h2></div>} />
    </Routes>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
