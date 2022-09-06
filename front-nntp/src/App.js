import logo from './logo.svg';
import './App.css';

function Marceli(props) {
  let data1 = {};
  fetch('../groups')
  .then((response) => response.json())
  .then((data) => {
    data1 = Object.values(data);
    console.log(typeof data1)
  });
  return (
    <ul>
      {data1.map(data2 => {
        return (
          <li key={data2}>{data2}</li>
        )
      })}
    </ul>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Marceli name={{title:"Koza to super kolega, ale nie zna się na żartach"}}></Marceli>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
