import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as React from 'react'

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
        <button type='button' onClick={() => {onRemoveItem(item)}}>Remove Item</button>
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, {data: [], isLoading: false, isError: false}
  )

  React.useEffect(()=>{
    if (!searchTerm) return

    dispatchStories({
      type: 'STORIES_FETCH_INIT'
    })
    fetch(`${API_ENDPOINT}${searchTerm}`)
    .then((res)=>
      res.json()
    )
    .then((result)=>{
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits
      })
    })
    .catch(()=> dispatchStories({type: 'STORIES_FETCH_FAILURE'}))
  },[searchTerm])

  const handleRemoveStory = (item) =>{
    dispatchStories({
      type: 'REMOVE_STORY', 
      payload: item
    })
  }
  
  // console.log(newStories);

  return(
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>

      <InputWithLabel id = 'search' onInputChange = {handleSearch} value = {searchTerm} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      {stories.isError && <p>...Seems like something went wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>):
      (<List list = {stories.data} onRemoveItem = {handleRemoveStory}/>)}
    </div>
    
  )
};

export default App;