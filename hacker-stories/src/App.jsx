import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as React from 'react'

const welcome = {
  greeting: 'hey',
  title: 'React'
}

const List = ({list})=>(
      <ul>
        {list.map(({objectID, ...item})=>
          <Item key = {objectID} {...item}/>
        )}
      </ul>
)

const Item = ({title, url, author, num_comments, points})=> (
  <li >
    <span><a href={url}>{title}</a></span>
    <span> {author}</span>
    <span> {num_comments}</span>
    <span> {points}</span>
  </li>
)


const InputWithLabel = ({id, label, onInputChange, type = 'text', value})=>(
  <>
    <label htmlFor= {id}> {label}:</label>
    <input type= {type} id = {id} ionChange={onInputChange} placeholder='Search for anything' value={value}/>

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


const App = ()=>{
  const [searchTerm, setSearchTerm] = useStorageState('search','React')

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const stories = [
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

  const searchedStories = stories.filter((story)=>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  console.log('App rendered');
  
  return(
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>

      <InputWithLabel id = 'search' label = 'search' onInputChange = {handleSearch} value = {searchTerm}/>

      <hr />
      <List list = {searchedStories}/>
    </div>
    
  )
};

export default App;