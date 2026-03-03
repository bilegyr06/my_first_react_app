// import { useState } from 'react'
// import reactLogo from './assets/react.svg?'
// import viteLogo from '/vite.svg'
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
const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, '')
// const getLastSearches = (urls: any)  => urls.slice(-5).map((url: any)=> extractSearchTerm(url))
const getLastSearches = (urls: Array<string>): Array<string> => {
  return [... new Set(urls.reverse().slice(-6).slice(0,-1).map(extractSearchTerm))]
} //more concise method

const getUrl = (searchTerm: string) => `${API_ENDPOINT}${searchTerm}`

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=%27'

const App = () =>{
  const [searchTerm, setSearchTerm] = useStorageState('search','React')
  const [urls, setUrls] = React.useState([
    getUrl(searchTerm),
  ])

  const handleSearch = (searchTerm:string) => {
    const url = `${API_ENDPOINT}${searchTerm}`
    setUrls(urls.concat(url))
  }

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>)=>{
    handleSearch(searchTerm)
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
      const lastUrl = urls[urls.length - 1]
      const result = await axios.get(lastUrl); 

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.hits
      })
    } catch {
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    }
  },[urls])

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

  const handleLastSearch = (searchTerm: string) => {
    handleSearch(searchTerm)
    setSearchTerm(searchTerm)
  }

  const lastSearches = getLastSearches(urls)

  return(
    <div className='container'>
      <h1 className='headline-primary'>Hacker Stories</h1>
      <SearchForm searchTerm = {searchTerm} onSearchInput = {handleSearchInput} onSearchSubmit = {handleSearchSubmit}/>

      {lastSearches.map((searchTerm:string, index: number)=>(
        <button
         key={searchTerm + index}
         type='button'
         onClick={() =>handleLastSearch(searchTerm)}
        >
          {searchTerm}
        </button>
      ))}

      {stories.isError && <p>...Seems like something went wrong...</p>}
      {stories.isLoading ? (<p>Loading...</p>):
      (<List list = {stories.data} onRemoveItem = {handleRemoveStory}/>)}
    </div>
    
  )
};

export default App;

export type { Story }
export { storiesReducer, SearchForm, InputWithLabel, List}