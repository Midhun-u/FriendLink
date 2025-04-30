import React from "react";
import { decryptMessageFunction, getMessageTime } from "../utilities/utilities";
import { assets } from "../assets/assets";
import { NavLink } from "react-router";

const AddedUsers = ({
  addedUsers,
  setMessageScreen,
  setReceiver,
  userProfile,
}) => {

  return (
    <>
      {addedUsers.length ? (
        addedUsers?.map((user, index) => (
          <div
            onClick={() => {
              setMessageScreen(true);
              setReceiver(user);
            }}
            className="w-full h-auto relative rounded-md min-h-25 px-5 bg-white grid grid-cols-[70px_200px_auto] lg:grid-cols-[70px_200px_auto] xl:grid-cols-[80px_200px_auto] cursor-pointer gap-4 py-3"
            key={index}
          >
            <div className="flex flex-col items-end justify-center relative">
              {user.profilePic ? (
                <img
                  className="lg:w-15 lg:h-16 xl:w-19 w-12 h-12 xl:h-20 rounded-full"
                  src={user.profilePic}
                  alt=""
                />
              ) : user.gender === "Male" ? (
                <img
                  className="lg:w-15 lg:h-16 xl:w-19 h-12 xl:h-20 rounded-full"
                  src={assets.maleGenderIcon}
                  alt=""
                />
              ) : (
                <img
                  className="lg:w-15 lg:h-16 xl:w-19 h-12 xl:h-20 rounded-full"
                  src={assets.femaleGenderIcon}
                  alt=""
                />
              )}
              {user.online ? (
                <div className="w-2 h-2 absolute bottom-5 lg:bottom-2 lg:right-3 rounded-full bg-green-600"></div>
              ) : null}
            </div>
            <div className="w-full h-full overflow-hidden flex flex-col justify-center">
              <span className="lg:text-xl font-medium">{user.fullName}</span>
              <span
                className={`text-textColor h-auto max-h-12 overflow-hidden`}
              >
                {user.lastMessages.length && Array.isArray(user.lastMessages)
                  ? decryptMessageFunction(
                    user.lastMessages.find(
                      (message) =>
                        message.sender === userProfile._id ||
                        message.receiver === userProfile._id,
                    ).message || "File",
                  )
                  : ""}
              </span>
            </div>
            <div className="flex justify-end w-20 absolute right-2 top-4">
              <span className="text-textColor lg:text-md text-sm">
                {user.lastMessages.length && Array.isArray(user.lastMessages)
                  ? getMessageTime(
                    user.lastMessages.find(
                      (message) =>
                        message.sender === userProfile._id ||
                        message.receiver === userProfile._id,
                    ).createdAt,
                  )
                  : ""}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img className="w-30 h-30" src={assets.noUsersFoundIcon} alt="" />
          <NavLink
            to="/people"
            className="mt-10 px-3 py-1 bg-blue-600 text-white rounded-md "
          >
            Add people
          </NavLink>
        </div>
      )}
    </>
  );
};

export default AddedUsers;
