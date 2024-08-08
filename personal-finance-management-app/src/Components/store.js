import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: localStorage.getItem("loggedIn") ? localStorage.getItem("loggedIn") : '0'
  
}

const checkLoggedIn = (state,action) => {   
    const newValue = action.payload;
    localStorage.setItem("loggedIn", newValue);
    const isLoggedIn = newValue;
      return  isLoggedIn;
}

const checkLoginSlice = createSlice({
    name: "login",
    initialState: initialState.isLoggedIn,
    reducers: {
        checkLoggedIn
    }
});


export const store = configureStore({
    reducer: {
        isLoggedIn: checkLoginSlice.reducer,

    }
});

export const IS_LOGGEDIN = checkLoginSlice.actions