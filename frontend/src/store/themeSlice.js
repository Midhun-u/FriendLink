import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    theme : localStorage.getItem("Theme") || "white"
}

const themeSlice = createSlice({
    name : "theme",
    initialState : initialState,
    reducers : {

        darkTheme : (state) => {

            state.theme = "dark"
            localStorage.setItem("Theme" , state.theme)
        },
        whiteTheme : (state) => {
            state.theme = "white"
            localStorage.setItem("Theme" , state.theme)
        }

    }
})

export default themeSlice.reducer
export const {darkTheme , whiteTheme} = themeSlice.actions