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

type SortKey = {
  sortKey: keyof typeof SORTS,
  isReverse: boolean
}

const List = React.memo(
  ({list, onRemoveItem}:ListProps)=>{

  const [sort, setSort] = React.useState<SortKey>({
    sortKey: 'NONE',
    isReverse: false
  })

  const handleSort = (sortKey: SortKey['sortKey']) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({ sortKey, isReverse })

  }

  // console.log(SORTS[sort])

  const sortFunction = SORTS[sort.sortKey] // fix the issue with the implicit any type
  const sortedList = (sort.isReverse) ? sortFunction(list).reverse(): sortFunction(list)

    return(
      <ul>
        <li style={{fontWeight: 'bold', backgroundColor: '#8e8e8e', marginBlockEnd: '.5em'}}>
          <span style={{ width: '35%'}}>{ sort.sortKey === 'TITLE' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('TITLE')}>Title ⬆️</button> : <button onClick={()=>handleSort('TITLE')}>Title 🟰</button> }</span>
          <span style={{ width: '20%' }}>{ sort.sortKey === 'AUTHOR' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('AUTHOR')}>Author ⬆️</button> : <button onClick={()=>handleSort('AUTHOR')}>Author 🟰</button> }</span>
          <span style={{ width: '20%' }}>{ sort.sortKey === 'COMMENT' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('COMMENT')}>Comments ⬆️</button> : <button onClick={()=>handleSort('COMMENT')}>Comments 🟰</button> }</span>
          <span style={{ width: '15%' }}>{ sort.sortKey === 'POINT' ? <button style={{backgroundColor: '#470ecd'}} onClick={()=>handleSort('POINT')}>Points ⬆️</button> : <button onClick={()=>handleSort('POINT')}>Points 🟰</button> }</span>
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