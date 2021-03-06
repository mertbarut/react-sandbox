import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anectodeSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    castVote(state, action) {
      const id = action.payload
      const anectodeToVote = state.find(anecdote => anecdote.id === id)
      const votedAnectode = {
        ...anectodeToVote,
        votes: anectodeToVote.votes + 1
      }
      return state.map(a =>
        a.id !== id ? a : votedAnectode
      )
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    removeAnecdotes(state, action) {
      const id = action.payload
      return state.filter(anecdote => anecdote.id !== id)
    }
  }
})

export const { castVote, appendAnecdote, setAnecdotes, removeAnecdotes } = anectodeSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const castVoteForAnecdote = id => {
  return async dispatch => {
    const changedAnecdote = await anecdoteService.changeVotesById(id, 1)
    dispatch(castVote(id))
  }
}

export const removeAnecdote = id => {
  return async dispatch => {
    await anecdoteService.deleteAnecdote(id)
    dispatch(removeAnecdotes(id))
  }
}

export default anectodeSlice.reducer