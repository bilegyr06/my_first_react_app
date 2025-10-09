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
  const handleRemoveItem = () => {
    onRemoveItem(item)
  }
  return (
    <li >
      <span><a href={item.url}>{item.title}</a></span>
      <span> {item.author}</span>
      <span> {item.num_comments}</span>
      <span> {item.points}</span>
      <span>
        <button type='button' onClick={handleRemoveItem}>Remove Item</button>
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
 
  const initialStories = [
    {
      title: ' React ',
      url: ' https://react.dev/ ',
      author: 'Jordan Walke ', 
      num_comments: 3,
      points: 4, 
      objectID: 0, 
    }, 
    {title: ' Redux ', 
      url: ' https://redux.js.org/ ', 
      author: ' Dan Abramov, Andrew Clark', 
      num_comments: 2, 
      points: 5, 
      objectID: 1
    }
  ] 


const App = ()=>{
  const [searchTerm, setSearchTerm] = useStorageState('search','React')
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const [stories, setStories] = React.useState(initialStories)
  const handleRemoveStory = (item) =>{
    const newStories = stories.filter((story)=>
    item.objectID !== story.objectID)
    // console.log(`search story removed: ${newStories}`)

    setStories(newStories)
  }
  
  const searchedStories = stories.filter((story)=>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  // console.log(newStories);
  
  return(
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>

      <InputWithLabel id = 'search' onInputChange = {handleSearch} value = {searchTerm} isFocused>
        <strong>Search:</strong>
      </InputWithLabel>

      <hr />
      <List list = {searchedStories} onRemoveItem = {handleRemoveStory}/>
    </div>
    
  )
};

export default App;