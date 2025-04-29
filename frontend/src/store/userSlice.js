import {createSlice} from '@reduxjs/toolkit'

const initialState = {

    loading : false,
    userData : {},
    errorMessage : null,
    auth : false
}

const userSlice = createSlice({
    
    name : "user",
    initialState : initialState,
    reducers : {

        authRequest : (state) => {

            state.loading = true

        },
        authSuccess : (state , action) => {

            state.loading = false,
            state.userData = action.payload
            state.auth = true

        },
        authFail : (state , action) => {

            state.loading = false,
            state.userData = {}
            state.errorMessage = action.payload.message
            state.auth = false
        }

    }

})

export default userSlice.reducer
export const{authFail , authRequest , authSuccess} = userSlice.actions