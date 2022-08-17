import { ContextApi } from "../helper/ContexApi";
import { useContext } from "react";

export const useContextApi = () => {
  return useContext(ContextApi);
};
