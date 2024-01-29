import React from 'react';
import logo from './logo.svg';

//import useState and useEffect hooks
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import BasicTable from './components/BasicTable/BasicTable';
import { DataRow } from './components/DataRow';
import RestClient from './services/RestClient';
import SocketClient from './services/SocketClient';
import ChatInputWithSend from './components/ChatInput/ChatInputWithSend';
import styles from './App.module.css';
import { ConversationData, TestMessage } from './DataSetConversation';
import AIChatBox from './components/ChatInput/AIChatBox';
import { Message } from './components/ChatInput/ChatHistory';



function App() {

  //state to hold our websocket session_id
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationData, setConversationData] = useState<ConversationData | null>(null);
  const restClient = RestClient.getInstance();
  const socketClient = SocketClient.getInstance('http://localhost:5001');
  const [messages, setMessages] = useState<Message[]>([]);
  const [layoutState, setLayoutState] = useState<string>('mainLayout');


  // Registering endpoints
  restClient.registerEndpoint('submit_query', { url: 'http://localhost:5001/submit_query', method: 'POST' });
  restClient.registerEndpoint('test', { url: 'http://localhost:5001/test', method: 'POST' });

  // Connecting to the socket
  useEffect(() => {
    socketClient.subscribe("submit_query_update", x => {
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
  const handleSubmit = async (content: string) => {

    //createa JSON to send
    const json = {
      input: content,
      session_id: sessionId
    };

    setMessages([...messages, { type: 'text', content, timestamp: new Date(), sender: 'You' }]);

    //log it
    console.log(json);

    restClient.makeRequest<TestMessage>('test', json)
      .then(data => {
        console.log(data);
        console.log(data.reply);
        setMessages(prevMessages => [...prevMessages, { type: 'text', content: data.reply, timestamp: new Date(), sender: 'Assistant' }]);
      })
      .catch(error => {
        console.error(error);
      });
  };


  function renderLayout(state: string) {
    switch (state) {
      case 'initialLayout':
        return (
          <div className={styles.initialLayout}>
            <div className={styles.header}><Header /></div>
            <div className={styles.mainPanel}>
              <ChatInputWithSend onSubmit={handleSubmit} />
            </div>
          </div>
        );
      case 'mainLayout':
        return (
          <div className={styles.mainLayout}>
            <div className={styles.header}><Header /></div>
            <div className={styles.sidebar}>  
              <AIChatBox messages={messages}  handleSendMessage={handleSubmit} />
            </div>
          </div>
        );
      default:
        return (<div />);
    }
  }


  return (
    <div>
      {renderLayout(layoutState)}
    </div>
  );
}

export default App;
