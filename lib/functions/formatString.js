export const formatStringLength = (string) => {
  if (typeof string !== "string") return;
  let newString = "";
  if (string.length > 10) {
    newString = string.slice(0, 10) + "...";
  } else {
    newString = string;
  }
  return newString;
};
