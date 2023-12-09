import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import BasicTable from './components/BasicTable';
import { DataRow } from './components/DataRow';

//some data for the basic table, should be DataRows
const data: DataRow[] = [
  { header: 'Name', value: 'Jimmi Hendrix' },
  { header: 'Email', value: 'jimmi@jobby.com' },
  { header: 'Phone', value: '1234567890' },
  { header: 'Address', value: '1234 Main St, Anytown, USA' }];


function App() {
  return (
    <div className="App">
    <Header />
    <BasicTable data={data} />
   </div>


  );
}

export default App;
