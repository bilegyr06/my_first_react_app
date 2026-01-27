import * as React from 'react'
import Check from './check.svg?react'
import { ListProps, ItemProps, Story } from './types.ts'
import { sortBy } from 'lodash'


const SORTS = {
  NONE: (list: Story[]) => list,
  TITLE: (list: Story[]) => sortBy(list, 'title'),
  AUTHOR: (list: Story[]) => sortBy(list, 'author'),
  COMMENT: (list: Story[]) => sortBy(list, 'num_comments').reverse(),
  POINT: (list: Story[]) => sortBy(list, 'points').reverse(),
} as const

type SortKey = keyof typeof SORTS

const List = React.memo(
  ({list, onRemoveItem}:ListProps)=>{

  const [sort, setSort] = React.useState<SortKey>('NONE')

  const handleSort = (sortKey: SortKey) => {
    setSort(sortKey)

  }

  // console.log(SORTS[sort])

  const sortFunction = SORTS[sort] // fix the issue with the implicit any type
  const sortedList = sortFunction(list)

    return(
      <ul>
        <li style={{fontWeight: 'bold'}}>
          <span style={{ width: '35%'}}>{ sort === 'TITLE' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('TITLE')}>Title ⬆️</button> : <button onClick={()=>handleSort('TITLE')}>Title 🟰</button> }</span>
          <span style={{ width: '20%' }}>{ sort === 'AUTHOR' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('AUTHOR')}>Author ⬆️</button> : <button onClick={()=>handleSort('AUTHOR')}>Author 🟰</button> }</span>
          <span style={{ width: '20%' }}>{ sort === 'COMMENT' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('COMMENT')}>Comments ⬆️</button> : <button onClick={()=>handleSort('COMMENT')}>Comments 🟰</button> }</span>
          <span style={{ width: '15%' }}>{ sort === 'POINT' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('POINT')}>Points ⬆️</button> : <button onClick={()=>handleSort('POINT')}>Points 🟰</button> }</span>
          <span style={{ width: '10%' }}>Action</span>
        </li>
        {sortedList.map((item)=> // Fix the issue with the implicit 'any' type
          <Item key = {item.objectID} item = {item} onRemoveItem = {onRemoveItem}/>
        )}
      </ul>
    )
  }
)


const Item = ({item, onRemoveItem}: ItemProps)=>(
  <li >
    <span style={{ width: '35%' }}><a href={item.url}>{item.title}</a></span>
    <span style={{ width: '20%' }}> {item.author}</span>
    <span style={{ width: '20%' }}> {item.num_comments}</span>
    <span style={{ width: '15%' }}> {item.points}</span>
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