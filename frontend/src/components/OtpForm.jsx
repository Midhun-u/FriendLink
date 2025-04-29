import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { changePassowordApi, sendOtpApi } from "../api/authApi";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router";

const OtpForm = ({ userEmail, otpDetails, setOtpDetails }) => {
  const limit = 4;
  const [otp, setOtp] = useState(new Array(limit).fill(""));
  const [count, setCount] = useState(60);
  const [resendOtp, setResendOtp] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs?.current[0].focus();
  }, []);

  useEffect(() => {
    let timer = null;

    if (count > 0 && !resendOtp) {
      timer = setInterval(() => {
        setCount((preCount) => preCount - 1);
      }, 1000);
    } else if (count === 0) {
      setResendOtp(true);
    }

    return () => clearInterval(timer);
  }, [count, resendOtp]);

  //function for changing otp value
  const handleOtp = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  //function focus input field backward
  const handleDelete = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  //function for resent otp
  const handleResendOtp = async () => {
    try {
      if (userEmail) {
        const result = await sendOtpApi(userEmail);
        if (result.success) {
          console.log(result);
          toast.success(result.message);
          setOtpDetails(result.otpData);
          setCount(60);
          setResendOtp(false);
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

  //function for submit otp
  const submitOTP = async () => {
    if (otp.includes("")) {
      toast.error("Fill otp");
    } else {
      const otpDigits = otp.join("");

      if (Date.now() > otpDetails.expireDate) {
        toast.error("OTP expire");
      } else if (otpDigits !== otpDetails.otpDigits) {
        toast.error("OTP incorrect");
      } else {
        toast.success("Success");
        setPasswordField(true);
      }
    }
  };

  //function for change password
  const changePassowrd = async () => {
    const { newPassword, confirmPassword } = password;

    if (newPassword && confirmPassword) {
      if (confirmPassword === newPassword) {
        try {
          if (newPassword.length < 6) {
            return toast.error("Password must be 6 letters or above");
          }

          const result = await changePassowordApi(newPassword, userEmail);

          if (result.success) {
            toast.success(result.message);
            navigate("/login");
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          const errorMessage = error.response.data.message;

          if (errorMessage) {
            toast.error(errorMessage);
          } else {
            toast.error("Something went wrong");
          }
        }
      } else {
        toast.error("Passwords are not match");
      }
    } else {
      toast.error("Fill the fields");
    }
  };

  return (
    <div className="mt-20 flex flex-col items-center">
      <h1 className="lg:text-xl">
        Enter Your{" "}
        <span className="text-secondary">
          {passwordField ? "new password" : "OTP"}
        </span>
      </h1>
      {passwordField ? (
        <div className="mt-10 flex flex-col items-center gap-4 w-screen px-5 lg:w-auto lg:px-0 md:w-screen md:px-40">
          <div className="w-full relative flex flex-col justify-center">
            <input
              className="rounded-sm outline-none w-full h-12 border-1 px-3 lg:border-2 focus:border-blue-600 pr-10 lg:h-12 lg:w-100 lg:px-3 lg:text-xl"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              onChange={(event) =>
                setPassword({
                  ...password,
                  newPassword: event.target.value.trim(),
                })
              }
              value={password.newPassword}
            />
            {showPassword ? (
              <img
                onClick={() => setShowPassword(false)}
                className="absolute top-3 cursor-pointer right-3 w-6 h-6 lg:w-8 lg:h-8 lg:top-2"
                src={assets.disablePassword}
                alt=""
              />
            ) : (
              <img
                onClick={() => setShowPassword(true)}
                className="absolute top-3 cursor-pointer right-3 w-6 h-6 lg:w-8 lg:h-8 lg:top-2"
                src={assets.showPassword}
                alt=""
              />
            )}
          </div>
          <input
            className="rounded-sm outline-none w-full h-12 border-1 px-3 lg:border-2 focus:border-blue-600 lg:h-12 lg:w-100 lg:px-3 lg:text-xl"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(event) =>
              setPassword({
                ...password,
                confirmPassword: event.target.value.trim(),
              })
            }
            value={password.confirmPassword}
          />
          <button
            onClick={changePassowrd}
            className="bg-secondary rounded-md cursor-pointer text-white active:bg-blue-900 trans w-full h-12 lg:w-100 lg:h-12 lg:text-xl"
          >
            Change password
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3 mt-10">
            {otp?.map((digit, index) => (
              <input
                className="inset-ring-2 inset-ring-black outline-none text-center focus:inset-ring-primary w-14 h-13 lg:w-18 lg:h-17 lg:text-2xl"
                type="text"
                key={index}
                value={digit}
                maxLength={1}
                ref={(element) => (inputRefs.current[index] = element)}
                onChange={(event) => handleOtp(event.target.value, index)}
                onKeyDown={(event) => handleDelete(index, event)}
              />
            ))}
          </div>
          <div className="w-full flex flex-col items-center mt-10 lg:w-auto">
            <button
              onClick={submitOTP}
              className="bg-primary rounded-md cursor-pointer text-white active:bg-violet-800 trans w-full h-12 lg:w-80 lg:h-12 lg:text-xl"
            >
              Submit
            </button>
            {resendOtp ? (
              <p className="mt-10 text-sm lg:text-xl">
                Don't receive OTP ?
                <span
                  onClick={handleResendOtp}
                  className="ml-2 text-primary cursor-pointer"
                >
                  Resent OTP
                </span>
              </p>
            ) : (
              <p className="mt-10 text-sm lg:text-xl">
                Resend OTP in {count} seconds
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OtpForm;
