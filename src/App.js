import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';



function App() {
  let live = true;
  const [news, setNews] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchString, setSearchString] = useState();
  const searchInputRef = useRef();

  useEffect( () => {
    if(live){
      FetchNews();
    }
    return () => {
      live = false;
    }
  },[])


  async function FetchNews(searchValue){
    var response
    if(searchValue){
      response= await axios.get(`http://hn.algolia.com/api/v1/search?query=${searchValue}`);
    } else{
      response= await axios.get("http://hn.algolia.com/api/v1/search?query=reacthooks");
    }
     

      if(response.status !== 200){
        setLoading(false);
        setError(response.statusText);

      } else{
        setLoading(false);
        setNews(response.data.hits);
      }
  }

  

  function handleSearchInput(event) {
    setSearchString(event.currentTarget.value);
  }

  function submitQuery(e){
    e.preventDefault();
    if(searchString)  {
      setLoading(true);
      FetchNews(searchString);}
  }

  function clearInput(e){
      setSearchString('');
      searchInputRef.current.focus()
  }

  return (
    <div className="container max-w-md mx-auto p-4 m-2 bg-purple-100 shadow-lg rounded">
    <img className="float-right h-12" src="https://icon.now.sh/react/c0c" alt="React Logo"/>
    <h2 className="text-grey-darkest font-thin">Developer News</h2>
    <form className="mb-2" onSubmit={submitQuery}>
    <input className="border p-1 rounded" ref={searchInputRef} value={searchString} type="text" name="search" id="search" onChange={e=>handleSearchInput(e)}/>
    <button className="bg-orange-500 rounded m-1 p-1"  type="submit">Search</button>
    <button className="bg-teal-500 m-1 text-white rounded p-1" onClick={(e)=>clearInput(e)} type='button'>clear input</button>
    </form>
    
    {loading?<div className="font-bold text-orange-500">fetching results....</div>:<div>{news?news.map(entry=>{
      let NewsEntryComponent=null;
      if(entry.url){
        NewsEntryComponent = <ul className="list-reset leading-normal " style={{display: 'flex',   flexDirection: 'column', marginBottom:8}} key={entry.objectID}>
      <li>
      <a className="text-indigo-600 rk hover:text-indigo-900" href={entry.url}> {entry.title}</a>
      </li>
      
    </ul>
      }
       
    return NewsEntryComponent; 
    }):null}</div>
      }
      <div className="text-red-500 font-bold">{error? error:null}</div>
    </div>
  );
}

export default App;
