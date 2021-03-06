const reducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter
    default:
      return state
  }
}

export const noteFilterChange = filter => {
  return {
    type: 'SET_FILTER',
    filter,
  }
}

export default reducer