import React from "react";
import {
  decryptMessageFunction,
  getMessageTime,
} from "../utilities/utilities";
import { assets } from "../assets/assets"
import {useSelector} from 'react-redux'

const SearchUsers = ({ searchUsers, setMessageScreen, setReceiver , userProfile}) => {

  const {theme} = useSelector(state => state.theme)

  return (
    <>
      {searchUsers?.map((searchUser, index) => (
        <div
          onClick={() => {
            setMessageScreen(true);
            setReceiver(searchUser);
          }}
          className={`w-full h-auto rounded-md min-h-25 px-5 ${theme === "dark" ? "bg-blackForeground" : "bg-white"} grid grid-cols-[70px_200px_auto] lg:grid-cols-[70px_200px_auto] xl:grid-cols-[80px_200px_auto] cursor-pointer gap-4 py-3`}
          key={index}
        >
          <div className="flex flex-col items-end justify-center relative">
            {searchUser.profilePic ? (
              <img
                className="lg:w-15 lg:h-16 xl:w-19 w-12 h-12 xl:h-20 rounded-full"
                src={searchUser.profilePic}
                alt=""
              />
            ) : searchUser.gender === "Male" ? (
              <img
                className="lg:w-15 lg:h-16 xl:w-19 h-12 xl:h-20 rounded-full"
                src={assets.maleGenderIcon}
                alt=""
              />
            ) : (
              searchUser.gender === "Female"
              ?
              <img
                className="lg:w-15 lg:h-16 xl:w-19 h-12 xl:h-20 rounded-full"
                src={assets.femaleGenderIcon}
                alt=""
              />
              :
              <img className="lg:w-15 lg:h-16 xl:w-19 h-12 xl:h-20 rounded-full" src={assets.nullProfilePic} alt="" />
            )}
            {searchUser.online ? (
              <div className="w-2 h-2 absolute bottom-5 lg:bottom-2 lg:right-3 rounded-full bg-green-600"></div>
            ) : null}
          </div>
          <div className="w-full h-full overflow-hidden flex flex-col justify-center">
            <span className={`lg:text-xl font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
              {searchUser.fullName}
            </span>
            <span className="text-textColor">
              {Array.isArray(searchUser.lastMessages) && searchUser.lastMessages.length > 0
                ?
                  decryptMessageFunction(
                      searchUser.lastMessages.find(
                        (message) =>
                          message.sender === userProfile._id ||
                          message.receiver === userProfile._id
                      )?.message || "File"
                    )
                : ""}
            </span>
          </div>
          <div className="md:flex hidden lg:hidden justify-end xl:flex">
            <span className="text-textColor lg:text-md text-sm">
              {Array.isArray(searchUser.lastMessages) && searchUser.lastMessages.length > 0
                  ?
                  getMessageTime(
                      searchUser.lastMessages.find(
                        (message) =>
                          message.sender === userProfile._id ||
                          message.receiver === userProfile._id
                      )?.createdAt
                    )
                : ""}
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default SearchUsers;
