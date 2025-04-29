import React from "react";
import { BarLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="w-auto h-auto flex justify-center items-center">
      <BarLoader color="#6060d3" />
    </div>
  );
};

export default Loader;
