import { useQuery } from "react-query";
import { GetAllUserWorkspaceInviteResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetAllUserWorkspaceInvite = qs.stringifyUrl({
    url: `users/invite`,
  });
  const { data } = await axios.get<GetAllUserWorkspaceInviteResponse>(apiGetAllUserWorkspaceInvite);
  return data;
};

export default function useAllUsersWorkspaceInviteResponse() {
  return useQuery<GetAllUserWorkspaceInviteResponse>(["AllUserWorkspaceInvite"], () => handleRequest());
}
