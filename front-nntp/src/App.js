import logo from './logo.svg';
import './App.css';
import React, {useEffect, useState} from "react"

function Groups() {
  const [groups, setGroups] = useState("");

  useEffect(() => {
    const url = "../groups";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.array);
        const grupa = json.array.map((data) => {return <li key={data}>{data}</li>})
        setGroups(grupa);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  },[]);

  
  return (
    <ul>{groups}</ul>
  )

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Groups></Groups>
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
