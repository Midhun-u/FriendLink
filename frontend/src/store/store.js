import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import usersReducer from './peopleSlice'
import themeReducer from './themeSlice'

const store = configureStore({
    reducer : {
        user : userReducer,
        people : usersReducer,
        theme : themeReducer
    }
})

export default store