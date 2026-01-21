import { describe, it , expect, vi } from 'vitest'
import axios from 'axios'
import {
render,
screen,
fireEvent,
waitFor,
} from '@testing-library/react';
import App from './App.tsx'
import { SearchForm } from './SearchForm'
import { InputWithLabel } from './InputWithLabel'
import { List } from './List'
import { Item } from './List.tsx'


vi.mock('axios')
const storyOne = {
    title: 'Reactjs',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
};
const storyTwo = {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
};
const stories = [storyOne, storyTwo];

describe('storiesReducer', ()=> {
    it('removes a story from all stories', ()=> {
        const action = {type: 'REMOVE_STORY', payload: storyOne}
        const state = {data: stories, isLoading: false, isError: false}

        const newState = storiesReducer(state, action)
        const expectedState = {data: [storyTwo], isLoading: false, isError: false}

        expect(newState).toStrictEqual(expectedState)
    })

    it('fetches a list of stories from a remote API', ()=> {
        const action = {type: 'STORIES_FETCH_INIT'}
        const state = {data: [], isLoading: false, isError: false}

        const newState = storiesReducer(state, action)
        const expectedState = {data: [], isLoading: true, isError: false}

        expect(newState).toStrictEqual(expectedState)
    })

    it('fetching the list comes out succcesful', ()=>{
        const action = {type: 'STORIES_FETCH_SUCCESS', payload: stories}
        const state = {data: [], isLoading: true, isError: false}

        const newstate = storiesReducer(state, action)
        const expectedState = {data: stories, isLoading: false, isError: false}

        expect(newstate).toStrictEqual(expectedState)
    })

    it('fetching the list fails', ()=>{
        const action = {type: 'STORIES_FETCH_FAILURE'}
        const state = {data: [], isLoading: true, isError: false}

        const newstate = storiesReducer(state, action)
        const expectedState = {data: [], isLoading: false, isError: true}

        expect(newstate).toStrictEqual(expectedState)
    })

})

describe('SearchForm', ()=>{
    const searchProps = {
        searchTerm:'Reactjs',
        onSearchSubmit : vi.fn(),
        onSearchInput: vi.fn()
    }
    it('it submits a search query on click of a button', ()=>{
        render(<SearchForm {...searchProps}></SearchForm>)
        // screen.debug()
        expect(screen.getByDisplayValue('Reactjs')).toBeInTheDocument()
    })

    it('renders the correct label', ()=>{
        render(<SearchForm {...searchProps}></SearchForm>)
        expect(screen.getByLabelText(/Search/)).toBeInTheDocument()
    })

    it('calls onSearchInput on input change', ()=>{
        render(<SearchForm {...searchProps}></SearchForm>)

        fireEvent.change(screen.getByDisplayValue('Reactjs'), {
            target: {value: 'Redux'}
        })

        expect(searchProps.onSearchInput).toHaveBeenCalledTimes(1)
    })

    it('calls onSearchSubmit on clicking submit button', ()=>{
        render(<SearchForm {...searchProps}></SearchForm>)

        fireEvent.click(screen.getByRole('button'))

        expect(searchProps.onSearchSubmit).toHaveBeenCalledTimes(1)
    })
})

describe('Item', ()=>{
    it('renders all the properties', ()=>{
    render(<Item item = {storyOne}></Item>)
    
    // screen.debug()
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument()
    expect(screen.getByText('Reactjs')).toHaveAttribute('href',"https://reactjs.org/")
    })

    it('renders a dismissable button',()=>{
        render(<Item item = {storyTwo}></Item>)

        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('calls the callback-handler when the dismiss button is clicked', ()=>{
        const handleRemoveItem = vi.fn()

        render(<Item item = {storyTwo} onRemoveItem={handleRemoveItem}></Item>)
        fireEvent.click(screen.getByRole('button'))
        expect(handleRemoveItem).toHaveBeenCalledTimes(1)
    })
})


describe('App component', ()=>{
    it('requests some initial stories from an API and succeeds', async ()=>{
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        })

        axios.get.mockImplementationOnce(()=> promise)
        render(<App></App>)
        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        await waitFor(async ()=> await promise)
        expect(screen.queryByText(/Loading/)).toBeNull();

        expect(screen.getByText('Reactjs')).toBeInTheDocument()
        expect(screen.getByText('Redux')).toBeInTheDocument()
        expect(screen.getAllByRole('button').length).toBe(3);
    })

    it('requests some initial stories from an API and fails', async ()=>{
        const promiseToFail = Promise.reject()

        axios.get.mockImplementationOnce(()=> promiseToFail)
        render(<App></App>)
        expect(screen.queryByText(/Loading/)).toBeInTheDocument()

        try{
            await waitFor(async ()=> promiseToFail)
        }
        catch(error){
            expect(screen.queryByText(/Loading/)).toBeNull()
            expect(screen.queryByText(/Seems like something went wrong/)).toBeInTheDocument()
        }
    })

    it('removes a story', async ()=>{
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        })

        axios.get.mockImplementationOnce(()=> promise)
        render(<App></App>)

        await waitFor(async ()=> await promise)
        expect(screen.getAllByRole('button').length).toBe(3)
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument()
        expect(screen.getByText('Reactjs')).toBeInTheDocument()

        fireEvent.click(screen.getAllByRole('button')[1])

        expect(screen.getAllByRole('button').length).toBe(2)
        expect(screen.queryByText('Jordan Walke')).toBeNull()
        expect(screen.queryByText('Reactjs')).toBeNull()
    })


    it('searches for specific stories', async ()=>{
        const reactPromise = Promise.resolve({
            data: {
                hits: stories
            }
        })

        const anotherStory = {
            title: 'JavaScript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3,
        };

        const jsPromise = Promise.resolve({
            data: {
                hits: [anotherStory]
            }
        })

        axios.get.mockImplementation((url)=>{
            if (url.includes('React')){
                return reactPromise
            }

            if (url.includes('Javascript')){
                return jsPromise
            }

            throw new Error()
        })

        render(<App></App>)
        //First API call
        await waitFor(async ()=> await reactPromise)

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('Javascript')).toBeNull()
        
        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument()
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument()

        fireEvent.change(screen.queryByDisplayValue('React'), {
            target: {value: 'Javascript'}
        })

        expect(screen.queryByDisplayValue('Javascript')).toBeInTheDocument()
        expect(screen.queryByDisplayValue('React')).toBeNull()

        fireEvent.submit(screen.queryByText('Submit'))
        // second data fetching
        await waitFor(async ()=> await jsPromise)

        expect(screen.queryByText('Brendan Eich')).toBeInTheDocument()
        expect(screen.queryByText('Jordan Walke')).toBeNull()

    })
})