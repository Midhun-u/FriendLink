import React, { useEffect, useId, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { googleLoginAuthApi, loginAuthApi } from "../api/authApi";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../api/firebase";
import Footer from "../components/Footer";

const Login = () => {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const sectionOneRef = useRef(null); //for animation
  const sectionTwoRef = useRef(null); //for animation

  useEffect(() => {
    sectionOneRef.current.style.transform = `translateX(${-550}px)`;
    sectionTwoRef.current.style.transform = `translateX(${550}px)`;

    setTimeout(() => {
      sectionOneRef.current.style.transition = `transform 0.4s ease-in-out`;
      sectionOneRef.current.style.transform = `translateX(${0}px)`;
      sectionTwoRef.current.style.transition = `transform 0.4s ease-in-out`;
      sectionTwoRef.current.style.transform = `translateX(${0}px)`;
    });
  }, []);

  //function for login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      if (userData.email && userData.password) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regex for checking valid email
        const check = emailRegex.test(userData.email);

        if (check) {
          const result = await loginAuthApi(userData.email, userData.password);

          if (result.success) {
            toast.success(result.message);
            navigate("/");
          } else {
            toast.error(result.message);
          }
        } else {
          toast.error("Enter valid email address");
        }
      } else {
        toast.error("Fill all fields");
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

  //function for google login
  const googleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await signInWithPopup(auth, googleProvider);
      const user = await response.user;

      if (user.email) {
        const result = await googleLoginAuthApi(user.email);

        if (result.success) {
          toast.success(result.message);
          navigate("/");
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response.data.message;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-[auto_auto] lg:p-10 bg-gray-100 overflow-y-scroll overflow-x-hidden">
      <div
        ref={sectionOneRef}
        className="w-full h-auto flex justify-center lg:items-center lg:h-full pt-3 lg:pt-0"
      >
        <img className="w-40 h-20 lg:w-60 lg:h-60" src={assets.logo} alt="" />
      </div>
      <div
        ref={sectionTwoRef}
        className="w-full h-full flex flex-col items-center justify-start lg:p-10 lg:justify-center"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-xl lg:text-3xl">Login</h1>
          <p className="bg-secondary py-1 px-2 mt-2 rounded-full text-sm text-white lg:mt-5 lg:font-normal lg:py-2 lg:px-4">
            Welcome to FriendLink
          </p>
        </div>
        <form className="flex w-full px-5 md:w-[60%] lg:px-0 lg:w-auto flex-col mt-20 gap-5 lg:gap-8">
          <div className="flex flex-col gap-2 lg:w-120">
            <label className="text-md lg:text-xl" htmlFor={emailId}>
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
          <div className="flex flex-col gap-2 relative lg:w-120">
            <label className="text-md lg:text-xl" htmlFor={passwordId}>
              Password
            </label>
            <input
              className="outline-none w-full h-10 py-2 px-5 transition-[border] duration-200 rounded focus:border-2 focus:shadow-[0px_0px_0px] focus:border-secondary lg:h-12 lg:px-5 lg:text-xl shadow-[0px_0px_2px]"
              type={showPassword ? "text" : "password"}
              id={passwordId}
              placeholder="Enter your password"
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
                className="absolute w-5 h-5 top-10.5 right-2 cursor-pointer lg:top-12 lg:w-6 lg:h-6"
                src={assets.disablePassword}
                alt=""
              />
            ) : (
              <img
                onClick={() => setShowPassword(true)}
                className="absolute w-5 h-5 top-10.5 right-2 cursor-pointer lg:top-12 lg:w-6 lg:h-6"
                src={assets.showPassword}
                alt=""
              />
            )}
          </div>
          <div className="flex justify-end">
            <NavLink className="text-primary" to="/forget-password">
              Forget password ?
            </NavLink>
          </div>
          <div className="flex items-center gap-1">
            <hr className="w-full" />
            <p className="text-sm lg:text-lg">Or</p>
            <hr className="w-full" />
          </div>
          <div className="flex flex-col items-center gap-5 lg:gap-2">
            <button
              onClick={googleLogin}
              className="flex items-center justify-center gap-3 cursor-pointer bg-white hover:bg-gray-100 transition-[background-color] duration-400 hover:shadow-[0px_0px_0px] rounded w-full h-10 lg:py-5 lg:h-15"
            >
              <img
                className="w-4 h-4 lg:w-6 lg:h-6"
                src={assets.googleImg}
                alt=""
              />
              <span className="text-sm lg:text-xl">Login with google</span>
            </button>
            <button
              className="cursor-pointer bg-secondary py-3 text-white w-full text-sm rounded lg:text-xl lg:py-5 lg:mt-2"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="font-normal text-sm gap-1 flex mt-4 pb-30 lg:text-xl lg:pb-0">
              Don't have an account ?
              <NavLink to="/sign" className="text-blue-600">
                Sign up
              </NavLink>
            </p>
          </div>
        </form>
      </div>
      <div className="w-full h-10 bg-white flex justify-center items-center absolute bottom-0 left-0">
        <Footer />
      </div>
    </div>
  );
};

export default Login;
