import './App.css';


import React, { useState, useEffect } from 'react';


function getCsrfToken() {
  return document.cookie.split('; ')
    .find(row => row.startsWith('csrftoken'))
    ?.split('=')[1];
}


const Card = ({ item }) => {

  const imagePath = process.env.PUBLIC_URL + item.image;

  const descriptionWithLineBreaks = item.desc.split('\n').map((line, index) => (
    <span key={index}>
        {line}
        <br />
    </span>
  ));

  const addItemToBasket = (event) => {
    console.log(event.target)
    fetch(`http://localhost:8000/webstore/add_item/${event.target.dataset.id}/`, {
      method: 'POST',
      credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error adding item: ', error);
    });
  }

  return (
      <div className='Card'>
          <table style={{ 
            minWidth: '100%',
            }}> <tbody><tr>

            <td style={{ width: '175px'}}><img src={imagePath} style={{ maxWidth: '175px', minWidth: '50px'}} /></td>

            <td style={{ minWidth: '300px', width: '35%'}}>
              <h3>{item.name}</h3>
              <p>{descriptionWithLineBreaks}</p>
            </td>


            <td>
              <p>{item.price} €</p>
            </td>

            { !item.is_owner ?  <td><input data-id={item.id} type='submit' value='Add to basket' onClick={addItemToBasket}/></td> :null}
            { item.is_owner ?  <td><input disabled data-id={item.id} type='submit' value='Your item' /></td> :null}

            </tr></tbody>
          </table>

          <div className='dateStamp'>Added: {item.date}</div>
      </div>
  );
}


const Header = ({ setMaterialId, setSearchTerm, setShowSideBar, showSideBar, showBasket, setShowBasket }) => {

  function handleSearchInput(text) {
    text = text.replace(/<[^>]*>?/gm, '');
    setSearchText(text);
  }

  const [searchText, setSearchText] = useState('');
  const [searchList, setSearchList] = useState([]);
  const [showDropdown, setShowDropDown] = useState(false)


  useEffect(() => {
    if (searchText === '') {
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
      console.log(error)
    });
  }, [searchText]);


  return (
    
    <header>
      
      <div  className='menuButton' onClick={() => setShowSideBar(!showSideBar)}>
        
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
                      setShowDropDown(false);
                    }}>{item.name+": "+item.price+" €"}
                  </li>
                  
                  ))}
                </ul>
              </div>
            )
          }

        </form>

        <div onClick={() => setShowBasket(!showBasket)}>Basket</div>

      </div>

    </header>
  )
}


const SideBar = ( {showSideBar, setLoggedIn, loggedIn, reloadTrigger, setReloadTrigger} ) => {

  
  const [showItemError, setShowItemError] = useState(false);
  const [showItemSuccess, setShowItemSuccess] = useState(false);
  const [showPassError, setShowPassError] = useState(false);
  const [showPassSuccess, setShowPassSuccess] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const csrfToken = getCsrfToken();

    if (event.target.password.value === '' || event.target.username.value === '') {
      return;
    }
    
    fetch('http://localhost:8000/webstore/login_user/', {
      method: 'POST',
      
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed');
      }
    })
    .then(data => {
      console.log(data)
      setLoggedIn(true)
      setReloadTrigger(reloadTrigger + 1)
    })
    .catch(error => {
      console.error('Error', error);
    });
  }

  const handleUserCreate = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const csrfToken = getCsrfToken();

    fetch('http://localhost:8000/webstore/add_user/', {
      method: 'POST',
      
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,
      credentials: 'include'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('User create failed');
      }
    })
    .then(data => {
      console.log(data)
      setLoggedIn(true);
    })
    .catch(error => {
      console.error('Error', error);
    });
  }

  const createItem = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const csrfToken = getCsrfToken();

    fetch('http://localhost:8000/webstore/create_item/', {
      method: 'POST',

      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        setShowItemSuccess(false)
        setShowItemError(true)
        throw new Error('Unsuccessful')
      }
    })
    .then(data => {
      setShowItemSuccess(true)
      setShowItemError(false)
      console.log(data);
      event.target.reset()
    })
    .catch(error => {
      console.error('Error', error);
      setShowItemSuccess(false)
      setShowItemError(true)
    });
  }

  const handleLogout = (event) => {

    setLoggedIn(false)

    fetch('http://localhost:8000/webstore/logout_user/', {
      method: 'GET',
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Unsuccessful')
      }
      return response.json();
    })
    .then(data => {
      //console.log("logged out");
      setReloadTrigger(reloadTrigger + 1)
    })
    .catch(error => {
      console.error('Error', error);
    });
  }

  const changePassword = (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const csrfToken = getCsrfToken();

    event.target.reset()

    fetch('http://localhost:8000/webstore/change_password/', {
      method: 'POST',

      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,

      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        setShowPassError(true)
        setShowPassSuccess(false)
        throw new Error('Unsuccessful')
      }
    })
    .then(data => {
      console.log(data);
      setShowPassSuccess(true)
      setShowPassError(false)
    })
    .catch(error => {
      console.error('Error', error);
    });
  }

  //style={{ animation: `${showSideBar ? ' 0.2s  ease-out slideInFromLeft' : ' 0.2s ease-in slideBackToRight'}` }}

  return (

  <aside className='sideBar' >


    {
      !loggedIn && (
        <div>
          <form className='forms' onSubmit={handleLogin}>
            <input name='username' className='formInputs' placeholder='Username'/>
            <input name='password' type='password' className='formInputs' placeholder='Password'/>
            <button type='submit' className='formInputs'>Login</button>
          </form>

          <br/>

          <form className='forms' onSubmit={handleUserCreate}>
            <input name='username' className='formInputs' placeholder='Username'/>
            <input name='email' className='formInputs' placeholder='Email'/>
            <input name='password' type='password' className='formInputs' placeholder='Password'/>
            <input name='conf_password' type='password' className='formInputs' placeholder='Confirm password'/>
            <button type='submit' className='formInputs'>Sign up</button>
          </form>
        </div>

      )
    }

    {
      loggedIn && (

        <div>

          <button className='logoutButton' onClick={handleLogout}>Log out</button>

          <br/>

          <form className='forms' method="post" onSubmit={createItem}>
            <input className='formInputs' type="text" name="title" id="title" placeholder="Title" />
            <input className='formInputs' type="text" name="description" id="description" placeholder="Description" />
            <input className='formInputs' type="number" name="price" id="price" placeholder="Price" />
            <input className='formInputs' type="submit" value="Create item" />
            {showItemError && (<p className='errorMessage'>Issue creating item</p>)}
            {showItemSuccess && (<p className='successMessage'>Item successfully created</p>)}
          </form>

          <br/>

          <form className='forms' method="post" onSubmit={changePassword}>
            <input className='formInputs' type="password" name="oldpass" id="oldpass" placeholder="Old password" />
            <input className='formInputs' type="password" name="conf_oldpass" id="conf_oldpass" placeholder="Confim old password" />
            <input className='formInputs' type="password" name="newpass" id="newpass" placeholder="New password" />
            <input className='formInputs' type="submit" value="Change password" />
            {showPassError && (<p className='errorMessage'>Passwords incorrect or not matching</p>)}
            {showPassSuccess && (<p className='successMessage'>Password successfully changed</p>)}
          </form>

        </div>
      )
    }




  </aside >
  )
}


const BasketCard = ( {item, reloadBasket, setReloadBasket} ) => {
  
  const removeItem = (event) => {
    event.preventDefault()

    const mat_id = event.target.dataset.item

    fetch(`http://localhost:8000/webstore/remove_item/${mat_id}/`, {
        method: 'POST',
        credentials: 'include',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
      console.log(data)
      setReloadBasket(reloadBasket + 1)
    })
    .catch(error => {
        console.error('Error removing item', error);
    });
  }
  
  return (
    <div className='basTop'>
      <div className='bas1'>
        <p className='basketName'>{item.name}</p>
        <p className='basketDesc'>{item.desc}</p>
      </div>
      <div className='bas2'>
        <p className='basketPric'>{item.price} €</p>
        <input data-item={item.material} type='submit' value="Remove" onClick={removeItem}/>
      </div>
      <br/><br/>
    </div>
  )
}


const Basket = ( {} ) => {
  
  const [basketData, setBasketData] = useState([]);
  const [reloadBasket, setReloadBasket] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:8000/webstore/get_basket/`, {
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
      setBasketData(data.items)
    })
    .catch(error => {
        console.error('Error fetching basket:', error);
    });
  }, [reloadBasket]);


  return (
    <aside className='basketBar' >
      {basketData.map(item => (
        <BasketCard key={item.id} item={item} reloadBasket={reloadBasket} setReloadBasket={setReloadBasket} />
      ))}
    </aside>
  )
}


function App() {

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState('null');
  const [materialId, setMaterialId] = useState(0);
  const [showSideBar, setShowSideBar] = useState(false);
  const [showBasket, setShowBasket] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);


  const goToNextPage = () => { setPageNumber(prevPageNumber => prevPageNumber + 1); window.scrollTo({top:0, left:0}) };
  const goToPreviousPage = () => { setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1)); window.scrollTo({top:0, left:0}) };




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
        setLastPage(data.lastpage);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  }, [pageNumber, searchTerm, materialId, reloadTrigger]);


  useEffect(() => {
    fetch(`http://localhost:8000/webstore/check_login/`, {
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
      setLoggedIn(data.loggedIn);
    })
    .catch(error => {
      console.error('Error checking login status:', error);
    });
  }, []);


  return (
    
    <div className="App">

      <Header setMaterialId={setMaterialId} setSearchTerm={setSearchTerm} setShowSideBar={setShowSideBar} showSideBar={showSideBar} showBasket={showBasket} setShowBasket={setShowBasket} ></Header>
      
      {
        showSideBar && (
          <SideBar showSideBar={showSideBar} setLoggedIn={setLoggedIn} loggedIn={loggedIn} reloadTrigger={reloadTrigger} setReloadTrigger={setReloadTrigger}></SideBar>
        )

      }

      {
        showBasket && (
          <Basket showBasket={showBasket}></Basket>
        )

      }

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

          <div className='pageButtons'>
            <div className='pgt'>Page: {pageNumber}</div>
            { pageNumber > 1 && <button className='pgb' onClick={goToPreviousPage} >Previous page</button>}
            { !lastPage && <button className='pgb' onClick={goToNextPage} >Next page</button>}
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
