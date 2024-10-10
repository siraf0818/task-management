import { useQuery } from "react-query";
import { GetWorkspaceMembersResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetWorkspaceMembers = qs.stringifyUrl({
    url: `workspace/${id}/members`,
  });
  const { data } = await axios.get<GetWorkspaceMembersResponse>(
    apiGetWorkspaceMembers
  );
  return data;
};

export default function useWorkspaceMembers(id: number) {
  return useQuery<GetWorkspaceMembersResponse>(
    ["WorkspaceMembers", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
