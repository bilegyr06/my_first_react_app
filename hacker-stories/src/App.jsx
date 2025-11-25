import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Check from './check.svg?react'
import * as React from 'react'
import axios from 'axios'

const welcome = {
  greeting: 'hey',
  title: 'React'
}

const List = ({list, onRemoveItem})=>(
  <ul>
    {list.map((item)=>
      <Item key = {item.objectID} item = {item} onRemoveItem = {onRemoveItem}/>
    )}
  </ul>
)

const Item = ({item, onRemoveItem})=>{
  return (
    <li >
      <span><a href={item.url}>{item.title}</a></span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
      <span>
        <button 
          type='button' 
          onClick={() => {onRemoveItem(item)}}
          >
            <Check height = '18px' width = '18px'></Check>
        </button>
      </span>
    </li>
  )
}

const InputWithLabel = ({id, onInputChange, type = 'text', isFocused, value, children})=>(
  <>
    <label htmlFor= {id}> {children}</label>
    &nbsp;
    <input type= {type} id = {id} onChange={onInputChange} placeholder='Search for anything' value={value} autoFocus = {isFocused}/>

    <p>
      Searching for <strong>{value}</strong>
    </p>      

  </>
)

const SearchForm = ({searchTerm, onSearchSubmit, onSearchInput}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel id = 'search' onInputChange = {onSearchInput} value = {searchTerm} isFocused>
      <strong>Search:</strong>
    </InputWithLabel>

    <button type='submit' disabled = {!searchTerm}>
      Submit
    </button>
  </form>
)

const useStorageState = (key, initialState) =>{
  const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState)

  React.useEffect(()=>{
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue]
}


// React.useEffect(()=>{
//   new Promise((resolve) => resolve({data: {stories: initialStories}}))
// }, [])

const storiesReducer = (state, action) => {
  switch (action.type) {
  case 'STORIES_FETCH_INIT':
    return {
      ...state,
      isLoading: true,
      isError: false
    };

  case 'STORIES_FETCH_SUCCESS':
    return {
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload
    }
  
  case 'STORIES_FETCH_FAILURE':
    return {
      ...state,
      isLoading: false,
      isError: true
    }
  
  case 'REMOVE_STORY':
    return { 
      ...state,
      data: state.data.filter(
    (story) => action.payload.objectID !== story.objectID
    )
  };
  default:
    throw new Error();
  }
}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=%27'

const App = () =>{
  const [searchTerm, setSearchTerm] = useStorageState('search','React')
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event)=>{
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault()
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, {data: [], isLoading: false, isError: false}
  )

  const handleFetchStories = React.useCallback(async ()=>{
    // no if (!searchTerm) return anymore because the button handles the emptyness of the search term
    dispatchStories({
      type: 'STORIES_FETCH_INIT'
    })

    try {
      const result = await axios.get(url); 

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    }
  },[url])

  React.useEffect(()=>{
    handleFetchStories()
    },[handleFetchStories])

  const handleRemoveStory = (item) =>{
    dispatchStories({
      type: 'REMOVE_STORY', 
      payload: item
    })
  }

  return(
    <div className='container'>
      <h1 className='headline-primary'>Hacker Stories</h1>
      <SearchForm searchTerm = {searchTerm} onSearchInput = {handleSearchInput} onSearchSubmit = {handleSearchSubmit}/>

      {stories.isError && <p>...Seems like something went wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>):
      (<List list = {stories.data} onRemoveItem = {handleRemoveStory}/>)}
    </div>
    
  )
};

export default App;