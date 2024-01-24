import React from 'react';
import logo from './logo.svg';

//import useState and useEffect hooks
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import BasicTable from './components/BasicTable/BasicTable';
import { DataRow } from './components/DataRow';
import RestClient  from './services/RestClient';
import SocketClient  from './services/SocketClient';
import './App.css';



function App() {

  const [data, setData] = useState<DataRow[]>([]);
  const restClient = new RestClient();
  const socketClient = new SocketClient('http://localhost:5001');

  // Registering endpoints
  restClient.registerEndpoint('test', { url: 'http://localhost:5001/test', method: 'GET' });


  // Fetching data from the API
  useEffect(() => {
    restClient.makeRequest<DataRow[]>('test')
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

  
  // Connecting to the socket
  useEffect(() => {
    socketClient.subscribe('test', () => 
    {
        console.log("SocketClient: test message received");
    });
  }, []);




  return (
    <div className="layout2">
    <div className="header-placeholder"><Header/></div>
    <div className="main-panel-placeholder"><BasicTable data={data}/></div>
    
    {/* <div className="sidebar-placeholder">Sidebar</div>
    <div className="footer-placeholder">Footer</div> */}
  </div>


  );
}

export default App;
