import * as React from 'react'
import Check from './check.svg?react'
import { ListProps, ItemProps } from './types.ts'

const List = React.memo<React.FC<ListProps>>(
  ({list, onRemoveItem}:ListProps)=>{

  const [sort, setSort] = React.useState('NONE')

  const handleSort = (sortKey: string) => {
    setSort(sortKey)
  }

    return(
      <ul>
        <li>
          <span style={{ width: '40%' }}> <button onClick={()=>handleSort('TITLE')}>Title</button> </span>
          <span style={{ width: '20%' }}> <button onClick={()=>handleSort('AUTHOR')}>Author</button></span>
          <span style={{ width: '20%' }}><button onClick={()=>handleSort('COMMENT')}>Comments</button></span>
          <span style={{ width: '10%' }}><button onClick={()=>handleSort('POINT')}>Points</button></span>
          <span style={{ width: '10%' }}><button onClick={()=>handleSort('ACTION')}>Action</button></span>
        </li>
        {list.map((item)=>
          <Item key = {item.objectID} item = {item} onRemoveItem = {onRemoveItem}/>
        )}
      </ul>
    )
  }
)


const Item: React.FC<ItemProps> = ({item, onRemoveItem}: ItemProps)=>(
  <li >
    <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
    <span style={{ width: '20%' }}> {item.author}</span>
    <span style={{ width: '20%' }}> {item.num_comments}</span>
    <span style={{ width: '10%' }}> {item.points}</span>
    <span style={{ width: '10%' }}>
      <button 
        type='button' 
        onClick={() => {onRemoveItem(item)}}
        >
          <Check height = '18px' width = '18px'></Check>
      </button>
    </span>
  </li>
)

export { List, Item }