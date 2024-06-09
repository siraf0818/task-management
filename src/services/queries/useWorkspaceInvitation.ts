import { useQuery } from "react-query";
import { GetWorkspaceInvitationResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetWorkspaceInvitation = qs.stringifyUrl({
    url: "user/invite",
  });
  const { data } = await axios.get<GetWorkspaceInvitationResponse>(
    apiGetWorkspaceInvitation
  );
  return data;
};

export default function useWorkspaceInvitation() {
  return useQuery<GetWorkspaceInvitationResponse>(["WorkspaceInvitation"], () =>
    handleRequest()
  );
}
