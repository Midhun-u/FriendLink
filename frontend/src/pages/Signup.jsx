import React, { useEffect, useId, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { assets } from "../assets/assets";
import { googleAuthApi, signAuthApi } from "../api/authApi";
import { toast } from "react-toastify";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../api/firebase";
import Footer from "../components/Footer";

const Signup = () => {
  const fullnameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const logoSection = useRef(); //for animation
  const signSection = useRef(); // for animation

  useEffect(() => {
    logoSection.current.style.transform = `translateX(${-550}px)`;
    signSection.current.style.transform = `translateX(${550}px)`;

    setTimeout(() => {
      logoSection.current.style.transition = `transform 0.4s ease-in-out`;
      logoSection.current.style.transform = `translateX(${0}px)`;
      signSection.current.style.transition = `transform 0.4s ease-in-out`;
      signSection.current.style.transform = `translateX(${0}px)`;
    });
  }, []);

  //function for sign
  const handleSign = async (event) => {
    event.preventDefault();

    try {
      if (userData.fullName && userData.email && userData.password) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regex for checking valid email
        const check = emailRegex.test(userData.email);

        if (check) {
          // check valid email

          if (!userData.password.length < 6) {
            const result = await signAuthApi(userData);

            if (result.success) {
              toast.success(result.message);
              navigate("/");
            } else {
              toast.error(result.message);
            }
          } else {
            toast.error("Password must be 6 letters or above");
          }
        } else {
          toast.error("Enter valid email address");
        }
      } else {
        toast.error("Fill all fields");
      }
    } catch (error) {
      const errorMessage = error.response?.data.message;
      console.log(error);

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  //function for google sign using firebase
  const googleAuth = async (event) => {
    event.preventDefault();

    try {
      const response = await signInWithPopup(auth, googleProvider); // fetch user data using firebase
      const user = await response.user;
      const result = await googleAuthApi(
        user.email,
        user.displayName,
        user.photoURL
      );

      if (result.success) {
        toast.success(result.message);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data.message;

      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="grid grid-cols-[auto] grid-rows-[150px] w-screen h-screen lg:grid-cols-[auto_auto] lg:p-5 lg:grid-rows-[auto] bg-gray-100 overflow-y-scroll overflow-x-hidden">
      <div
        ref={logoSection}
        className="w-full h-auto flex justify-center items-end lg:items-center lg:h-full"
      >
        <img className="w-40 h-20 lg:w-60 lg:h-60" src={assets.logo} alt="" />
      </div>
      <div
        ref={signSection}
        className="w-full h-full flex flex-col items-center justify-start lg:py-20 lg:px-10"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-lg lg:text-3xl">Create new account</h1>
          <p className=" bg-primary mt-2 py-1 px-5 text-white rounded-full text-sm lg:text-lg">
            Join the community
          </p>
        </div>
        <form className="flex w-full md:w-[60%] px-5 md:px-10 lg:px-0 flex-col items-center mt-20">
          <div className="w-full flex flex-col items-start lg:w-120 gap-2">
            <label className="text-md lg:text-lg" htmlFor={fullnameId}>
              Fullname
            </label>
            <input
              className="outline-none transition-[border] duration-200 w-full h-10 py-2 px-5 rounded focus:border-2 focus:shadow-[0px_0px_0px] focus:border-secondary lg:h-12 lg:px-5 lg:text-xl shadow-[0px_0px_2px]"
              type="text"
              placeholder="Enter you fullname"
              id={fullnameId}
              onChange={(event) =>
                setUserData({
                  ...userData,
                  fullName: event.target.value.trim(),
                })
              }
              value={userData.value}
            />
          </div>
          <div className="flex w-full flex-col items-start mt-6 lg:w-120 lg:gap-2 lg:mt-6">
            <label className="text-md lg:text-lg" htmlFor={emailId}>
              Email
            </label>
            <input
              className="outline-none transition-[border] duration-200 w-full h-10 py-2 px-5 rounded focus:border-2 focus:shadow-[0px_0px_0px] focus:border-secondary lg:h-12 lg:px-5 lg:text-xl shadow-[0px_0px_2px]"
              type="email"
              id={emailId}
              placeholder="Enter your email address"
              onChange={(event) =>
                setUserData({ ...userData, email: event.target.value.trim() })
              }
              value={userData.email}
            />
          </div>
          <div className="w-full flex flex-col items-start relative mt-6 lg:w-120 lg:gap-2 lg:mt-6">
            <label className="text-md lg:text-lg" htmlFor={passwordId}>
              Password
            </label>
            <input
              className="outline-none w-full h-10 py-2 px-5 transition-[border] duration-200 rounded focus:border-2 focus:shadow-[0px_0px_0px] focus:border-secondary lg:h-12 lg:px-5 lg:text-xl shadow-[0px_0px_2px]"
              type={showPassword ? "text" : "password"}
              id={passwordId}
              placeholder="Create password"
              onChange={(event) =>
                setUserData({
                  ...userData,
                  password: event.target.value.trim(),
                })
              }
              value={userData.password}
            />
            {showPassword ? (
              <img
                onClick={() => setShowPassword(false)}
                className="absolute w-6 h-6 top-8 right-2 cursor-pointer lg:top-12"
                src={assets.disablePassword}
                alt=""
              />
            ) : (
              <img
                onClick={() => setShowPassword(true)}
                className="absolute w-6 h-6 top-8 right-2 cursor-pointer lg:top-12"
                src={assets.showPassword}
                alt=""
              />
            )}
          </div>
          <div className="flex items-center w-full gap-1 mt-5 lg:w-120 lg:gap-1">
            <hr className="w-full" />
            <span className="text-md g:text-xl">Or</span>
            <hr className="w-full " />
          </div>
          <div className="flex flex-col items-center justify-center mt-6 w-full bg-gray-100 gap-5 lg:w-120">
            <button
              onClick={googleAuth}
              className="flex items-center justify-center gap-3 cursor-pointer bg-white hover:bg-gray-100 transition-[background-color] duration-400 hover:shadow-[0px_0px_0px] rounded w-full h-10 lg:py-5 lg:h-15"
            >
              <img
                className="w-4 h-4 lg:w-6 lg:h-6"
                src={assets.googleImg}
                alt=""
              />
              <span className="text-sm lg:text-xl">Sign up with Google</span>
            </button>
            <button
              className="cursor-pointer bg-primary py-3 text-white w-full rounded lg:text-xl lg:py-5"
              onClick={handleSign}
            >
              Create account
            </button>
            <p className="font-normal pb-10 text-sm lg:text-xl lg:pb-0">
              Already have an account ?{" "}
              <NavLink to="/login" className="text-blue-600">
                Login
              </NavLink>
            </p>
          </div>
        </form>
      </div>
      <div className="w-full h-10 absolute bg-white bottom-0 flex justify-center items-center">
        <Footer />
      </div>
    </div>
  );
};

export default Signup;
