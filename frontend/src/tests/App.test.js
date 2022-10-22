import React from 'react';
//import { act } from 'react-dom/test-utils';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import App from '../App.js';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test("'Add new' button creates a new short url to db", () => {
  render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
    );
  const addNewButton = screen.getByText("Shorten url");
  //let deleteButton = screen.queryByText("Delete");
  expect(addNewButton).toBeInTheDocument(); 

  const inputField = screen.getByLabelText("Enter URL")
  expect(inputField).toBeInTheDocument(); 

  fireEvent.change(inputField, {target: {value: 'www.testisivu.com'}})
  expect(screen.getByDisplayValue('www.testisivu.com')).toBeInTheDocument();
});