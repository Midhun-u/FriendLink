import React from "react";
import Sidebar from "../components/Sidebar";

const Settings = () => {
  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <div className="w-full h-full bg-gray-100"></div>
    </div>
  );
};

export default Settings;
