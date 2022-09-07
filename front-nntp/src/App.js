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
        const grupa = json.array.map((data) => {
          return (
            <li key={data}>
              <button type="button" onClick="" className="App-link">{data}</button>
            </li>
          );
        });
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
  const [route, setRoute] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        <h1>Grupy pl.*</h1>
      </header>
      <main className="App-main">
        <Groups></Groups>
      </main>
    </div>
  );
}

export default App;
