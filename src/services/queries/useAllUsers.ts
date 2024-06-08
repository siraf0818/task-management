import { useQuery } from "react-query";
import { GetAllUsersResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetAllUsers = qs.stringifyUrl({
    url: `users/all`,
  });
  const { data } = await axios.get<GetAllUsersResponse>(apiGetAllUsers);
  return data;
};

export default function useAllUsers() {
  return useQuery<GetAllUsersResponse>(["AllUsers"], () => handleRequest());
}
