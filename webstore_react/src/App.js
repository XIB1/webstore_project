import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const Card = ({ item }) => {

  const imagePath = process.env.PUBLIC_URL + item.image;

  const descriptionWithLineBreaks = item.desc.split('\n').map((line, index) => (
    <span key={index}>
        {line}
        <br />
    </span>
  ));

  console.log(item)

  return (
      <div style={{ 
        border: '1px solid #ddd',
        margin: '10px', 
        padding: '4px', 
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        maxHeight: '10%',
        }}>
          <table style={{ 
            //tableLayout: 'fixed',
            minWidth: '100%',
            maxHeight: '100px',
            }}> <tr>

            <td style={{ width: '175px'}}><img src={imagePath} style={{ maxWidth: '175px', minWidth: '50px'}} /></td>
            
            <td style={{ minWidth: '300px', width: '35%'}}>
              <h3>{item.name}</h3>
              <p>{descriptionWithLineBreaks}</p>
            </td>

            <td style={{ left: '50%'}}>
              <p>{item.stock} available in stock</p>
            </td>

            <td>
              <p>{item.price} €</p>
            </td>

            <td>
              <input type='submit' value='Add to basket'/>
              
            </td>

            </tr>
          </table>
      </div>
  );
};


function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/webstore/get_materials/1/', {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        setData(data.items);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }, []);



  return (
    <div className="App">
      


      <div style={{ 
        maxWidth: '1200px',
        minWidth: '600px',
        }}>

        {data.map(item => (
          <Card key={item.id} item={item} />
        ))}

      </div>

    </div>

  );
}
 
export default App;
