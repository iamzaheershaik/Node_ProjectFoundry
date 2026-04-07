import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],
}

let nextId = 0

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: nextId++,
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 5000,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      )
    },
    clearAllNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const { addNotification, removeNotification, clearAllNotifications } =
  notificationsSlice.actions

// Selectors
export const selectNotifications = (state) => state.notifications.notifications

export default notificationsSlice.reducer
