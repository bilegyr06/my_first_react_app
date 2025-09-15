import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import * as React from 'react'

const welcome = {
  greeting: 'hey',
  title: 'React'
}

const List = (props)=>{
  console.log('List rendered')
  return(
      <ul>
        {props.list.map(function (item){
          return <Item item = {item}/>
        })}
      </ul>
)
}

const Item = (props)=> {
  console.log('Item rendered')

  return(
  <li key = {props.item.objectID}>
    <span><a href={props.item.url}>{props.item.title}</a></span>
    <span> {props.item.author}</span>
    <span> {props.item.num_comments}</span>
    <span> {props.item.points}</span>
  </li>
)
}

const Search = (props)=>{
  return(
    <div>
      <label htmlFor="search"> Search:</label>
      <input type="text" id = 'search' onChange={props.onSearch} placeholder='Search for anything'/>

      <p>
        Searching for <strong>{props.searchTerm}</strong>
      </p>      

    </div>
  )
};

const App = ()=>{

  const [searchTerm, setSearchTerm] = React.useState('');

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

      <Search onSearch = {handleSearch} searchTerm = {searchTerm}/>

      <hr />
      <List list = {searchedStories}/>
    </div>
    
  )
};

export default App;