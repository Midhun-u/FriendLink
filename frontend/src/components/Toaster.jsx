import React from "react";
import { ToastContainer } from "react-toastify";

const Toaster = () => {
  return (
    <>
      <ToastContainer
        className="text-sm lg:text-md"
        position="top-center"
        hideProgressBar
        autoClose="2000"
        theme="dark"
        toastStyle={{ color: "white" }}
      />
    </>
  );
};

export default Toaster;
