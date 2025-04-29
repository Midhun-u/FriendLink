import {configureStore} from '@reduxjs/toolkit'
import userReducer from './userSlice'
import usersReducer from './peopleSlice'

const store = configureStore({
    reducer : {
        user : userReducer,
        people : usersReducer
    }
})

export default store