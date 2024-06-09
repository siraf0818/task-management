import { useQuery } from "react-query";
import { GetWorkspaceInvitationsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetWorkspaceInvitations = qs.stringifyUrl({
    url: `users/invite`,
  });
  const { data } = await axios.get<GetWorkspaceInvitationsResponse>(
    apiGetWorkspaceInvitations
  );
  return data;
};

export default function useWorkspaceInvitations() {
  return useQuery<GetWorkspaceInvitationsResponse>(
    ["WorkspaceInvitations"],
    () => handleRequest()
  );
}
