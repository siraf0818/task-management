import { useQuery } from "react-query";
import { GetWorkspaceBoardsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetWorkspaceBoards = qs.stringifyUrl({
    url: `workspace/${id}/boards`,
  });
  const { data } = await axios.get<GetWorkspaceBoardsResponse>(
    apiGetWorkspaceBoards
  );
  return data;
};

export default function useWorkspaceBoards(id: number) {
  return useQuery<GetWorkspaceBoardsResponse>(["WorkspaceBoards", id], () =>
    handleRequest(id)
  );
}
