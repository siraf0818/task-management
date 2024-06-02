import { useQuery } from "react-query";
import { GetUserDataResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetUserData = qs.stringifyUrl({
    url: "users",
  });
  const { data } = await axios.get<GetUserDataResponse>(apiGetUserData);
  return data;
};

export default function useUserData() {
  return useQuery<GetUserDataResponse>(["UserData"], () => handleRequest());
}
