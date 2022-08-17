import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export const sendNotification = async (docID, data) => {
  const docPostRef = doc(db, "Users", docID);
  await updateDoc(docPostRef, {
    notifications: arrayUnion(data),
  });
};

export const removeNotification = async (docID) => {
  const docPostRef = doc(db, "Users", docID);
  await updateDoc(docPostRef, {
    notifications: [],
  });
};
