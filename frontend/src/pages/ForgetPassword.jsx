import React, { useEffect, useId, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { sendOtpApi } from "../api/authApi";
import OtpForm from "../components/OtpForm";

const ForgetPassword = () => {
  const emailId = useId();
  const navigate = useNavigate();
  const inputRef = useRef();
  const [email, setEmail] = useState();
  const [otpScreen, setOtpScreen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpDetails, setOtpDetails] = useState();

  useEffect(() => {
    inputRef?.current.focus();
  }, []);

  //function for send otp
  const handleSendOtp = async () => {
    try {
      if (email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regex for checking valid email
        const check = emailRegex.test(email);

        if (check) {
          //function for sending otp
          const result = await sendOtpApi(email);

          if (result.success) {
            toast.success(result.message);
            setOtpDetails(result.otpData);
            setUserEmail(result.userEmail);
            setOtpScreen(true);
          } else {
            toast.error(result.message);
          }
        } else {
          toast.error("Enter valid Email address");
        }
      } else {
        toast.error("Input your Email");
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
    <div className="grid grid-cols-[auto] gap-0 w-screen h-screen lg:grid-cols-[auto_auto] bg-gray-100 lg:p-10">
      <div className="w-full h-50 flex justify-center lg:h-full lg:items-center ">
        <img className="w-50 h-50 lg:w-60 lg:h-60" src={assets.logo} alt="" />
      </div>
      <div className="mb-100 flex flex-col justify-start w-full h-full items-center lg:justify-center lg:mb-0">
        <div>
          <h1 className="text-xl lg:text-2xl">Change Password</h1>
        </div>
        {otpScreen ? (
          <OtpForm
            userEmail={userEmail}
            otpDetails={otpDetails}
            setOtpDetails={setOtpDetails}
          />
        ) : (
          <>
            <div className="flex flex-col mt-20 gap-2 w-full px-5 md:w-120 md:px-0 lg:w-auto lg:px-0">
              <label htmlFor={emailId}>Email</label>
              <input
                className="rounded-sm outline-none w-full h-12 border-1 px-3 lg:border-2 focus:border-blue-600 lg:h-12 lg:w-100 lg:px-3 lg:text-xl"
                type="email"
                id={emailId}
                placeholder="Enter your email address"
                ref={inputRef}
                onChange={(event) => setEmail(event.target.value.trim())}
                value={email}
              />
            </div>
            <div className="flex flex-col w-full px-5 gap-5 mt-10 md:w-120 md:px-0 lg:w-auto lg:px-0">
              <button
                onClick={handleSendOtp}
                className="bg-secondary text-white rounded-sm border-none cursor-pointer h-11 active:bg-blue-800 lg:w-100 lg:h-12 lg:text-lg"
              >
                Send OTP
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-white  shadow-black rounded-sm cursor-pointer h-12 w-full lg:w-100 lg:h-12 lg:text-lg"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
