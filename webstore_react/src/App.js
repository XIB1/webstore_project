import './App.css';


import React, { useState, useEffect, useRef } from 'react';


const Card = ({ item }) => {

  const imagePath = process.env.PUBLIC_URL + item.image;

  const descriptionWithLineBreaks = item.desc.split('\n').map((line, index) => (
    <span key={index}>
        {line}
        <br />
    </span>
  ));

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


const Header = ({ setMaterialId, setSearchTerm }) => {

  function handleSearchInput(text) {
    text = text.replace(/<[^>]*>?/gm, '');
    setSearchText(text);
  }

  const [searchText, setSearchText] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [showDropdown, setShowDropDown] = useState(false)

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

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


  return (
    
    <header>
      
      <div  className='menuButton'>
        
        <img src='menu.png' style={{ width: 'max(4vh, 36px)' }}/>

      </div>
      

      <div className='searchSection'>

        <button className='searchReset' onClick={() => {
          setMaterialId(0); 
          setSearchText(''); 
          setSearchTerm('null');
          setMaterialId(0);
          }}>Reset filters</button>

        <form 
          onSubmit={(event) => { 
            event.preventDefault();
            setSearchTerm(searchText);
            setShowDropDown(false);
            setMaterialId(0);
          }} 
          style={{width: '300px', margin: '10px'}}>

          <input 
            className='searchBar' 
            type='text' 
            value={searchText}
            onChange={(event) => {handleSearchInput(event.target.value); setShowDropDown(true)}} 
            placeholder='Search' 
            autoComplete='off'
          />
          
          {
            showDropdown && searchList.length > 0 && (
              <div className='dropdown'>
                <ul className='searchResults'>
                  {searchList.map(item => (
                  <li
                    className='searchList'
                    key={item.id}
                    onClick={(event) => {
                      setMaterialId(item.id);
                      setSearchText('');
                    }}>{item.name+": "+item.price+" €"}
                  </li>
                  
                  ))}
                </ul>
              </div>
            )
          }

        </form>

      </div>

    </header>
  )
}


function App() {

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('null');
  const [materialId, setMaterialId] = useState(0);


  const goToNextPage = () => setPageNumber(prevPageNumber => prevPageNumber + 1);
  const goToPreviousPage = () => setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));

  //console.log(`http://localhost:8000/webstore/get_materials/${pageNumber}/${searchTerm}/${materialId}/`)

  useEffect(() => {
    fetch(`http://localhost:8000/webstore/get_materials/${pageNumber}/${searchTerm}/${materialId}/`, {
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
  }, [pageNumber, searchTerm, materialId]);



  return (
    
    <div className="App">
      
      <Header setMaterialId={setMaterialId} setSearchTerm={setSearchTerm}></Header>

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
