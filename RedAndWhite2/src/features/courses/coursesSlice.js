import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filters: {
    category: 'all',
    level: 'all',
    duration: 'all',
    city: 'all',
    search: '',
  },
  selectedCourse: null,
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload
    },
    setSearchQuery: (state, action) => {
      state.filters.search = action.payload
    },
  },
})

export const { setFilter, resetFilters, setSelectedCourse, setSearchQuery } = coursesSlice.actions

// Selectors
export const selectFilters = (state) => state.courses.filters
export const selectSelectedCourse = (state) => state.courses.selectedCourse
export const selectSearchQuery = (state) => state.courses.filters.search
export const selectActiveCategory = (state) => state.courses.filters.category

export default coursesSlice.reducer
