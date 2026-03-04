import * as React from 'react'

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
};


const InputWithLabel = ({id, onInputChange, type = 'text', isFocused, value, children}: InputWithLabelProps)=>(
  <>
    <label htmlFor= {id}> {children}</label>
    <input type= {type} id = {id} onChange={onInputChange} placeholder='Search for anything' value={value} autoFocus = {isFocused}/>

    <p>
      Searching for <strong>{value}</strong>
    </p>      

  </>
)

export { InputWithLabel }