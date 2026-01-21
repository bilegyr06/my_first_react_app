import { useState } from 'react'
import reactLogo from './assets/react.svg?'
import viteLogo from '/vite.svg'
import './App.css'
import * as React from 'react'
import axios from 'axios'
import { SearchForm } from './SearchForm'
import { InputWithLabel } from './InputWithLabel'
import { List } from './List'
import { StoriesState, Story, StoriesAction } from './types'



const useStorageState = (key: string, initialState: string): [string, (newValue: string) => void] =>{
  const [value, setValue] = React.useState(localStorage.getItem(key) ?? initialState)

  React.useEffect(()=>{
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue] as const
}


// React.useEffect(()=>{
//   new Promise((resolve) => resolve({data: {stories: initialStories}}))
// }, [])

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>)=>{
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

  const handleRemoveStory = React.useCallback(
    (item: Story) =>{
    dispatchStories({
      type: 'REMOVE_STORY', 
      payload: item
    })
  } 
  ,[])

  console.log('B: App')

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

export type { Story }
export { storiesReducer, SearchForm, InputWithLabel, List}