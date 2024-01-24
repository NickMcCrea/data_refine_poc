import React from 'react';
import logo from './logo.svg';

//import useState and useEffect hooks
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import BasicTable from './components/BasicTable/BasicTable';
import { DataRow } from './components/DataRow';
import RestClient  from './services/RestClient';
import SocketClient  from './services/SocketClient';
import ChatInputWithSend from './components/ChatInput/ChatInputWithSend';
import './App.css';
import { ConversationData } from './DataSetConversation';



function App() {

  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const restClient = new RestClient();
  const socketClient = new SocketClient('http://localhost:5001');

  // Registering endpoints
  restClient.registerEndpoint('submit_query', { url: 'http://localhost:5001/submit_query', method: 'POST' });


  
  // Connecting to the socket
  useEffect(() => {
    socketClient.subscribe("submit_query_update", x => 
    {
        console.log('submit_query_update');
         console.log(x);
    });

    socketClient.subscribe("connected", x => {
     
      console.log(x);
  });

  }, []);

   // Function to handle chat input submission
   const handleSubmit = (inputValue: string) => {

    restClient.makeRequest<ConversationData>('submit_query', { input: inputValue })
      .then(data => {
        console.log(data);
        setConversationData(data);
    
      })
      .catch(error => {
        
        console.error(error);
      });
  };




  return (
    <div className="layout2">
    <div className="header-placeholder"><Header/></div>
    <div className="main-panel-placeholder">

    <ChatInputWithSend onSubmit={handleSubmit} />


    </div>

    {/* <div className="sidebar-placeholder">Sidebar</div>
    <div className="footer-placeholder">Footer</div> */}
  </div>


  );
}

export default App;
