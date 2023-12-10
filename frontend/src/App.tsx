import React from 'react';
import logo from './logo.svg';

//import useState and useEffect hooks
import { useState, useEffect } from 'react';

import './App.css';
import Header from './components/Header';
import BasicTable from './components/BasicTable';
import { DataRow } from './components/DataRow';
import { RestClient } from './services/RestClient';



function App() {

  const [data, setData] = useState<DataRow[]>([]);
  const restClient = new RestClient();

  // Registering endpoints
  restClient.registerEndpoint('test', { url: 'http://localhost:5001/test', method: 'GET' });


  // Fetching data from the API
  useEffect(() => {
    restClient.makeRequest<DataRow[]>('test')
      .then(data => setData(data))
      .catch(error => console.error(error));
  }, []);

    





  return (
    <div className="App">
      <Header />
      <BasicTable data={data} />
    </div>


  );
}

export default App;
