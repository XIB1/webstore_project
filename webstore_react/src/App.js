import logo from './logo.svg';
import './App.css';


import React, { useState, useEffect } from 'react';


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function searchBarType(event, setSearchList) {

  let text = event.target.value
  //setSearchText(event.target.value);

  fetch('http://localhost:8000/webstore/search_type/' + text, {
      method: 'GET',
  })

  .then(data => {
    setSearchList(data.items);
  })

  //console.log(searchList)

}

const Card = ({ item }) => {

  const imagePath = process.env.PUBLIC_URL + item.image;

  const descriptionWithLineBreaks = item.desc.split('\n').map((line, index) => (
    <span key={index}>
        {line}
        <br />
    </span>
  ));

  //console.log(item)

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
            minWidth: '100%',
            }}> <tbody><tr>

            <td style={{ width: '175px'}}><img src={imagePath} style={{ maxWidth: '175px', minWidth: '50px'}} /></td>

            <td style={{ minWidth: '300px', width: '35%'}}>
              <h3>{item.name}</h3>
              <p>{descriptionWithLineBreaks}</p>
            </td>

            <td style={{ left: '50%'}}>
              <p>{item.stock} in stock</p>
            </td>

            <td>
              <p>{item.price} €</p>
            </td>

            <td>
              <input type='submit' value='Add to basket'/>
              
            </td>

            </tr></tbody>
          </table>
      </div>
  );
};

const SearchListItem = ({item}) => {

  console.log("test")

  return (

  <li>{item.name}</li>

  )

}


const Header = () => {

  const [searchText, setSearchText] = useState('');
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/webstore/search_type/' + searchText, {
      method: 'GET',
    })
    .then(response => {
      if (!response.ok) {
        setSearchList([])
        throw 'testing error';
      }
      return response.json();
    })
    .then(data => {
      setSearchList(data.items);
    })
    .catch(error => {
      console.log('Error')
    });
  }, [searchText]);

  console.log('searchList: ' + searchList)
  console.log('searchText: ' + searchText)

  return (
    
    <header style={{ 
      height: 'max(7vh, 50px)',
      width: '100%',
      top: '0%',
      position: 'sticky',
      backgroundColor: 'limegreen',
      display: 'flex',
    }}>
      
      <div style={{ 
        left: '15px',
        top: '50%',
        transform: 'translateY(-50%)',
        position: 'absolute',
        }}>
        
        <img src='menu.png' style={{ width: 'max(4vh, 36px)' }}/>

      </div>

      <form style={{ 
        position: 'absolute',
        right: '2vw',
        top: '50%',
        transform: 'translateY(-50%)',
      }}>
        <input type='get' onChange={(event) => setSearchText(event.target.value)} placeholder='Search' id='searchbar' style={{fontSize: '16px'}}/>
        
        {
          searchList.length > 0 && (
            <div style={{position: 'fixed', backgroundColor: 'white', width: '100%'}}>
              <ul>
                {searchList.map(item => (
                <SearchListItem key={item.id} item={item} />
                ))}
              </ul>
            </div>
          )
        }

      </form>

    </header>
  )
}


function App() {

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);


  const goToNextPage = () => setPageNumber(prevPageNumber => prevPageNumber + 1);
  const goToPreviousPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));

  console.log(pageNumber)

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
      
      <Header></Header>

      <div style={{ 
        width: '80%',
        maxWidth: '1200px',
        minWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
        }}>

        {data.map(item => (
          <Card key={item.id} item={item} />
        ))}

        <div style={{ margin: '20px' }}>
          <button onClick={goToPreviousPage} >Previous page</button>
          <button onClick={goToNextPage} >Next page</button>
        </div>

      </div>


      <footer style={{ 
        height: '200px',
        backgroundColor: 'lightgrey',
        }}>

      </footer>

    </div>

  );
}
 
export default App;
