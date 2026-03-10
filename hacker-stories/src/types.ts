import * as React from 'react'

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};


type StoriesState = {
  data: Story[];
  page: number;
  isLoading: boolean;
  isError: boolean;
};

type StoriesFetchInitAction = {
  type: 'STORIES_FETCH_INIT';
}
type StoriesFetchSuccessAction = {
  type: 'STORIES_FETCH_SUCCESS';
  payload: {
    list: Story[];
    page: number;
  };
}
type StoriesFetchFailureAction = {
  type: 'STORIES_FETCH_FAILURE';
}
type StoriesRemoveAction = {
  type: 'REMOVE_STORY';
  payload: Story
}
type StoriesAction =
StoriesFetchInitAction
| StoriesFetchSuccessAction
| StoriesFetchFailureAction
| StoriesRemoveAction;


type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type ItemProps = {
  item: Story;
  onRemoveItem: (item: Story) => void;
};

type ListProps = {
list: Story[];
onRemoveItem: (item: Story) => void;
};


export type { Story, StoriesState, StoriesRemoveAction, StoriesFetchSuccessAction, StoriesFetchInitAction, StoriesFetchFailureAction, StoriesAction, ListProps, ItemProps, SearchFormProps}