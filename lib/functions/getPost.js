import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

const getPostCollection = async () => {
  const q = query(collection(db, "Post"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ docPostID: doc.id, ...doc.data() });
  });
  return result;
};

const getUserCollection = async () => {
  const q = query(collection(db, "Users"));
  const querySnapshot = await getDocs(q);
  const result = [];
  querySnapshot.forEach((doc) => {
    result.push({ userID: doc.id, ...doc.data() });
  });
  return result;
};

export const getUsers = async () => {
  const userCollection = await getUserCollection();
  return userCollection;
};

export const getPost = async () => {
  const userCollection = await getUserCollection();
  const postCollection = await getPostCollection();

  const result = [];
  postCollection.forEach((postData) => {
    const userInfo = userCollection.find(
      (data) => data.email === postData.userID
    );
    result.push({
      ...postData,
      isOnline: userInfo.isOnline,
      name: userInfo.name,
      userName: userInfo.userName,
      userProfile: userInfo.userProfile,
      isVerified: userInfo.isVerified,
    });
  });
  return result;
};
