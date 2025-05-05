import React from "react";
import { ToastContainer } from "react-toastify";
import {useSelector} from 'react-redux'

const Toaster = () => {

  const {theme} = useSelector(state => state.theme)

  return (
    <>
      <ToastContainer
        className="text-sm lg:text-md"
        position="top-center"
        hideProgressBar
        autoClose="2000"
        theme={theme === "dark" ? "dark" : "white"}
        toastStyle={theme === "dark" ? {color : "white" , backgroundColor : "#000000"} : {color : 'black' , backgroundColor : "white"}}
        closeButton={false}
      />
    </>
  );
};

export default Toaster;
