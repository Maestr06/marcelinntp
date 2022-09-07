import './App.css';
import React, {useEffect, useState} from "react"



export default function App() {
  const [route, setRoute] = useState("");

  function PickGroup({handlePickGroup,data}) {
    return <button id={data} type="button" onClick={handlePickGroup} className="App-link">{data}</button>
  }

  function PickArticle({handlePickArticle,data}) {
    return <button id={data} type="button" onClick={handlePickArticle} className="App-link">{data}</button>
  }
  
  function Groups() {
    const [groups, setGroups] = useState("");
  
    useEffect(() => {
      const url = "../groups";
  
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          // console.log(json.array);
          const grupa = json.array.map((data) => {
            return (
              <li key={data}>
                <PickGroup handlePickGroup={data1 => handlePickGroup(data1, data)} data={data}></PickGroup>
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

  function Articles() {
    const [articles, setArticles] = useState("");
  
    useEffect(() => {
      const url = "../articles";
  
      const fetchData = async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();
          // console.log(json);
          const articlesList = json.map((data) => {;
            return (
              <li key={data}>
                <PickArticle handlePickArticle={data1 => handlePickArticle(data1, data)} data={data}></PickArticle>
              </li>
            );
          });
          setArticles(articlesList);
        } catch (error) {
          console.log("error", error);
        }
      };
  
      fetchData();
    },[]);
  
    return (
      <ul>{articles}</ul>
    )
  }

  const [number, setNumber] = useState('');
  function Article({number}) {
    const [article, setArticle] = useState("");
  
    useEffect(() => {
      console.log(number)
      const url = "../article/" + number
  
      const fetchData = async () => {
        try {
          const article = await fetch(url);
          //console.log( await article.text());
          setArticle(await article.text());
        } catch (error) {
          console.log("error", error);
        }
      };
  
      fetchData();
    },[number]);
  
    return (
      <div className='article'>{article}</div>
    )
  }

  function handlePickGroup(event, name) {
    fetch("../group/"+name)
    setRoute(name);
    console.log(name);
  }

  function handlePickArticle(event, name) {
    setNumber(name);
    console.log(number);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Grupy pl.*</h1>
        <button className='App-back' onClick={() => {setRoute("");setNumber("")}}>Wróć do wyboru grup</button>
        <button className='App-back' onClick={() => {setNumber("")}}>Wróć do wyboru artykułów</button>
      </header>
      <main className="App-main">
        {!route && !number ? (<Groups></Groups>) : null}
        {route && !number ? (<Articles></Articles>) : null}
        {number ? (<Article number={number}></Article>) : null}
      </main>
    </div>
  );
}

// export default App;
