import { db } from "../config/firebase";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";

export const handleFollowUser = async ({ currentUserID, userTargetID }) => {
  const docRefTargetUser = doc(db, "Users", userTargetID);
  const docRefCurrentUser = doc(db, "Users", currentUserID);

  await updateDoc(docRefTargetUser, {
    followers: arrayUnion(currentUserID),
  });

  await updateDoc(docRefCurrentUser, {
    following: arrayUnion(userTargetID),
  });
};

export const handleUnfollowUser = async ({ currentUserID, userTargetID }) => {
  const docRefTargetUser = doc(db, "Users", userTargetID);
  const docRefCurrentUser = doc(db, "Users", currentUserID);

  await updateDoc(docRefTargetUser, {
    followers: arrayRemove(currentUserID),
  });

  await updateDoc(docRefCurrentUser, {
    following: arrayRemove(userTargetID),
  });
};
