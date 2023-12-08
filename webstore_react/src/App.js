import logo from './logo.svg';
import './App.css';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const Card = ({ item }) => {
  return (
      <div style={{ 
        border: '1px solid #ddd',
        margin: '10px', 
        padding: '10px', 
        borderRadius: '5px' 
        }}>
          <h3>Header</h3>
          <p>Description</p>
      </div>
  );
};

console.log(getCookie('basket_id'))

fetch('http://localhost:8000/webstore/get_materials/1/', {
  method:'GET',
  credentials:'include',
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

fetch('http://localhost:8000/webstore/get_basket/', {
  method:'GET',
  credentials:'include',
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Card/>
        <img src={logo} className="App-logo" alt="logo" />

      </header>
    </div>
  );
}
 
export default App;
