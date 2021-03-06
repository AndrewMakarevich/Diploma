import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ModalStore from './store/modalStore';
import { IGlobalContext } from './interfaces/storeInterfaces';
import UserStore from './store/userStore';
import PictureStore from './store/pictureStore';

export const Context: React.Context<IGlobalContext> = createContext({} as IGlobalContext);

ReactDOM.render(
  <Context.Provider value={
    {
      modalStore: new ModalStore(),
      userStore: new UserStore(),
      pictureStore: new PictureStore()
    }
  }>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Context.Provider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
