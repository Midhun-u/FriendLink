import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";

const Sidebar = () => {
  const [expand, setExpand] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header
        className={`hidden grid-rows-[auto_1fr_auto] lg:grid ${
          expand ? "lg:w-60 absolute" : "lg:w-20"
        } transition-[width] duration-300 z-10 lg:h-full py-7 bg-white `}
      >
        <div
          onClick={() => setExpand(!expand)}
          className="w-full h-13 flex justify-center items-center hover:bg-gray-100 cursor-pointer rounded-lg"
        >
          {expand ? (
            <img
              className="w-6 h-6 cursor-pointer"
              src={assets.closeIcon}
              alt=""
            />
          ) : (
            <img
              className="w-6 h-6 cursor-pointer "
              src={assets.menuIcon}
              alt=""
            />
          )}
        </div>
        <nav className="w-full h-auto flex flex-col items-center gap-7 justify-center">
          <nav
            onClick={() => navigate("/")}
            className={`w-full h-13 flex ${
              expand ? "justify-start px-3 gap-4" : "justify-center"
            } items-center hover:bg-gray-200 rounded-lg transition-[background-color] duration-400 cursor-pointer`}
          >
            <img
              className="w-9 h-9 cursor-pointer"
              src={assets.homeIcon}
              alt=""
              title="Home"
            />
            {expand ? <span>Home</span> : null}
          </nav>
          <nav
            onClick={() => navigate("/people")}
            className={`w-full h-13 flex ${
              expand ? "justify-start px-1 gap-4" : "justify-center"
            } items-center hover:bg-gray-200 rounded-lg transition-[background-color] duration-400 cursor-pointer`}
          >
            <img
              className={`${
                expand ? "w-12 h-12" : "w-12 h-12"
              } cursor-pointer `}
              src={assets.peopleIcon}
              alt=""
              title="People"
            />
            {expand ? <span>People</span> : null}
          </nav>
          <nav
            onClick={() => navigate("/notifications")}
            className={`w-full h-13 flex ${
              expand ? "justify-start px-3 gap-4" : "justify-center"
            } items-center hover:bg-gray-200 rounded-lg transition-[background-color] duration-400 cursor-pointer`}
          >
            <img
              className="w-9 h-9 cursor-pointer "
              src={assets.notificationIcon}
              alt=""
              title="Notifications"
            />
            {expand ? <span>Notifications</span> : null}
          </nav>
          <nav
            onClick={() => navigate("/profile")}
            className={`w-full h-13 flex ${
              expand ? "justify-start px-3 gap-4" : "justify-center"
            } items-center hover:bg-gray-200 rounded-lg transition-[background-color] duration-400 cursor-pointer`}
          >
            <img
              className="w-9 h-9 cursor-pointer "
              src={assets.profileIcon}
              alt=""
              title="Profile"
            />
            {expand ? <span>Profile</span> : null}
          </nav>
        </nav>
        <nav
          onClick={() => navigate("/settings")}
          className={`w-full h-13 flex ${
            expand ? "justify-start px-3 gap-4" : "justify-center"
          } items-center hover:bg-gray-200 rounded-lg transition-[background-color] duration-400 cursor-pointer`}
        >
          <img
            className="w-9 h-9 cursor-pointer"
            src={assets.settingIcon}
            alt=""
          />
          {expand ? <span>Settings</span> : null}
        </nav>
      </header>
      <header className="lg:hidden w-full h-18 px-5 grid grid-cols-[auto_1fr]">
        <div
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-full h-full flex justify-center items-center cursor-pointer z-10"
        >
          {showSidebar ? (
            <img className="w-5 h-5" src={assets.closeIcon} alt="" />
          ) : (
            <img className="w-5 h-5" src={assets.menuIcon} alt="" />
          )}
        </div>
        <div className="w-full h-full flex justify-center">
          <img className="w-30 h-full" src={assets.logo} alt="" />
        </div>
        <nav
          className={`w-[250px] h-screen bg-white z-9 absolute left-0 flex flex-col items-center justify-center ${
            showSidebar ? "translate-x-0" : "-translate-x-100 "
          } transition-all duration-300 ease-in gap-7`}
        >
          <div
            onClick={() => navigate("/")}
            className="w-full h-15 flex justify-start px-10 items-center hover:bg-gray-200 active:bg-gray-200 gap-4"
          >
            <img className="w-7 h-7" src={assets.homeIcon} alt="" />
            <span className="text-sm">Home</span>
          </div>
          <div
            onClick={() => navigate("/people")}
            className="w-full h-15 flex justify-start px-9 items-center hover:bg-gray-200 active:bg-gray-200 gap-4"
          >
            <img className="w-9 h-9" src={assets.peopleIcon} alt="" />
            <span className="text-sm">People</span>
          </div>
          <div
            onClick={() => navigate("/notifications")}
            className="w-full h-15 flex justify-start px-10 items-center hover:bg-gray-200 active:bg-gray-200 gap-4"
          >
            <img className="w-7 h-7" src={assets.notificationIcon} alt="" />
            <span className="text-sm">Notifications</span>
          </div>
          <div
            onClick={() => navigate("/profile")}
            className="w-full h-15 flex justify-start px-10 items-center hover:bg-gray-200 active:bg-gray-200 gap-4"
          >
            <img className="w-7 h-7" src={assets.profileIcon} alt="" />
            <span className="text-sm">Profile</span>
          </div>
          <div
            onClick={() => navigate("/settings")}
            className="w-full h-15 flex justify-start px-10 items-center hover:bg-gray-200 active:bg-gray-200 gap-4"
          >
            <img className="w-7 h-7" src={assets.settingIcon} alt="" />
            <span className="text-sm">Settings</span>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Sidebar;
