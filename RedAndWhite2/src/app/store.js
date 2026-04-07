import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
// Custom storage adapter (redux-persist/lib/storage doesn't work in Vite ESM)
const storage = {
  getItem: (key) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
}
import authReducer from '../features/auth/authSlice'
import coursesReducer from '../features/courses/coursesSlice'
import uiReducer from '../features/ui/uiSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import { coursesApi } from '../features/courses/coursesApi'
import { enrollmentsApi } from '../features/enrollments/enrollmentsApi'
import { authApi } from '../features/auth/authApi'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'isAuthenticated'],
}

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['selectedCity'],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  courses: coursesReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),
  notifications: notificationsReducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
  [enrollmentsApi.reducerPath]: enrollmentsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      coursesApi.middleware,
      enrollmentsApi.middleware,
      authApi.middleware
    ),
})

export const persistor = persistStore(store)
