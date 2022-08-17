import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

const getCompressImage = async (uri) => {
  const result = await manipulateAsync(uri, [], {
    compress: 0.5,
    format: SaveFormat.JPEG,
  });
  return result;
};

const getImageBolb = async (imageCompresseUri) => {
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", imageCompresseUri, true);
      xhr.send(null);
    });

    return blob;
  } catch (error) {
    alert("Upload failed, sorry :(");
    return error;
  }
};

export const uploadImage = async (imageCompresseUri) => {
  const compressedImage = await getCompressImage(imageCompresseUri);
  const imageBlob = await getImageBolb(compressedImage.uri);

  const imagePath = "imagePost/" + "IMG" + Date.now() + ".jpg";
  const imageRef = ref(storage, imagePath);
  await uploadBytesResumable(imageRef, imageBlob);
  return getDownloadURL(imageRef).then((url) => ({
    imageUri: url,
    path: imagePath,
  }));
};
