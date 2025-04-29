import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import Footer from "../components/Footer";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen grid grid-rows-[80px_1fr_80px] justify-items-center">
      <header className="w-full h-full bg-white flex justify-center items-center">
        <img className="w-35 h-10" src={assets.logo} alt="" />
      </header>
      <section className="w-full h-full bg-gray-100 flex flex-col gap-4 items-center lg:py-10 justify-center">
        <img className="w-50 h-50" src={assets.notFoundIcon} alt="" />
        <p className="lg:text-xl text-red-600">Page is not found</p>
        <button
          onClick={() => navigate("/")}
          className="lg:w-[40%] md:w-[60%] w-[80%] lg:text-lg md:text-md text-sm py-3 bg-secondary hover:bg-blue-900 active:bg-blue-900 text-white cursor-pointer rounded-xl"
        >
          Home page
        </button>
      </section>
      <div className="w-full h-full relative flex justify-center items-center">
        <Footer />
      </div>
    </div>
  );
};

export default NotFound;
