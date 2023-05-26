import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './userSlice'
import { chatsSlice } from './chatsSlice'
import { ticketsSlice } from './ticketsSlice'

export const store = configureStore({
  reducer: {
      user: userSlice.reducer,
      chats: chatsSlice.reducer,
      tickets:ticketsSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch