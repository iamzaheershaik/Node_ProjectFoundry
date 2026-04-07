import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedCity: 'Surat - AK Road',
  isMobileMenuOpen: false,
  isEnrollModalOpen: false,
  enrollModalCourse: null,
  activeModal: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false
    },
    openEnrollModal: (state, action) => {
      state.isEnrollModalOpen = true
      state.enrollModalCourse = action.payload || null
    },
    closeEnrollModal: (state) => {
      state.isEnrollModalOpen = false
      state.enrollModalCourse = null
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload
    },
  },
})

export const {
  setSelectedCity,
  toggleMobileMenu,
  closeMobileMenu,
  openEnrollModal,
  closeEnrollModal,
  setActiveModal,
} = uiSlice.actions

// Selectors
export const selectSelectedCity = (state) => state.ui.selectedCity
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen
export const selectIsEnrollModalOpen = (state) => state.ui.isEnrollModalOpen
export const selectEnrollModalCourse = (state) => state.ui.enrollModalCourse
export const selectActiveModal = (state) => state.ui.activeModal

export default uiSlice.reducer
