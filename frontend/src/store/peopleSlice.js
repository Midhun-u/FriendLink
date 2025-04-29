import {createSlice} from '@reduxjs/toolkit'

const initialState = {

    loading : false,
    people : [],
    errorMessage : null,

}

const usersSlice = createSlice({
    name : "people",
    initialState : initialState,
    reducers : {

        request : (state , action) => {

            state.loading = true

        },
        fetchPeople : (state , action) => {

            state.people = action.payload
            state.loading = false

        },
        failRequest : (state , action) => {
            state.loading = false,
            state.errorMessage = action.payload
            state.people = []
        },

    },
})

export default usersSlice.reducer
export const {request , fetchPeople , failRequest} = usersSlice.actions