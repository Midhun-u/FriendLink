import Crypto from "crypto-js";

//function for encrypt message
export const encryptMessageFunction = (messageForEncrypt) => {

  if (messageForEncrypt) {

    const encryptedMessage = Crypto.AES.encrypt(
      messageForEncrypt,
      import.meta.env.VITE_ENCRYPT_MESSAGE_SECRET
    ).toString();
    return encryptedMessage

  }

  return

};

//function for decrypt message
export const decryptMessageFunction = (encryptedMessage) => {

  if (encryptedMessage) {

    const bytes = Crypto.AES.decrypt(
      encryptedMessage,
      import.meta.env.VITE_ENCRYPT_MESSAGE_SECRET
    )

    const decryptedMessage = bytes.toString(Crypto.enc.Utf8);

    return decryptedMessage || encryptedMessage;
  }

  return ""

};

//function for get message time
export const getMessageTime = (dateForConverting) => {

  const date = new Date(dateForConverting);
  const today = new Date();

  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const year = date.getFullYear();

  const isToday = today.getUTCDate() === day && today.getUTCMonth() + 1 === month && today.getUTCFullYear() === year;

  if (isToday) {

    //Extract hours and minute
    let hours = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, 0) // if the minute 5 it add 05
    const AMorPM = hours >= 12 ? "PM" : "AM"

    //convert it into format hour
    hours = hours % 12 || 12;

    return `${hours}:${minute} ${AMorPM}`;
  } else {
    return `${day}/${month}/${year}`;
  }
};
