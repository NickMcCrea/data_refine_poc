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

  //state to hold our websocket session_id
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const restClient =  RestClient.getInstance();
  const socketClient = SocketClient.getInstance('http://localhost:5001');

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

      //capture the session_id from the JSON object
      const sessionId = x.session_id;
      //log it
      console.log("Connected, now setting session id")
      console.log(sessionId);

      //store it
      setSessionId(sessionId);
  });

  }, []);

   // Function to handle chat input submission
   const handleSubmit = (inputValue: string) => {

    //createa JSON to send
    const json = {
      input: inputValue,
      session_id: sessionId
    };

    //log it
    console.log(json);

    restClient.makeRequest<ConversationData>('submit_query', json)
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
