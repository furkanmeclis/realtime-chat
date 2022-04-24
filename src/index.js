import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const liveChats = document.querySelectorAll('live-chat');
liveChats.forEach((liveChat) => {
  if (liveChat) {
    let ownerId = liveChat.getAttribute('data-owner-id'),
    ownerName = liveChat.getAttribute('data-owner-name'),
    customerId = liveChat.getAttribute('data-customer-id'),
    customerName = liveChat.getAttribute('data-customer-name'),
    activeUserId = liveChat.getAttribute('data-active-user-id');
    ReactDOM.render( <React.StrictMode>
      <App ownerId={ownerId} ownerName={ownerName} customerId={customerId} customerName={customerName} activeUserId={activeUserId}/>
    </React.StrictMode>, liveChat);
  }
});
  


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
