import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export class HandleNotification {
  constructor(docTaretID) {
    this.docPostRef = doc(db, "Users", docTaretID);
  }

  async sendNotification(data) {
    await updateDoc(this.docPostRef, {
      notifications: arrayUnion(data),
    });
  }

  async removeNotification() {
    await updateDoc(this.docPostRef, {
      notifications: [],
    });
  }
}

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
