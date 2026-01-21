import * as React from 'react'
import {Story} from './App.tsx' 
import Check from './check.svg?react'
import { ListProps, ItemProps } from './types.ts'

const List = React.memo<React.FC<ListProps>>(
  ({list, onRemoveItem}:ListProps)=>(
  <ul>
    {list.map((item)=>
      <Item key = {item.objectID} item = {item} onRemoveItem = {onRemoveItem}/>
    )}
  </ul>
)
)

const Item: React.FC<ItemProps> = ({item, onRemoveItem}: ItemProps)=>(
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

export { List, Item }