import { useQuery } from "react-query";
import { GetBoardsCollaboratorResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetBoardsCollaborator = qs.stringifyUrl({
    url: `boards/${id}/collaborator`,
  });
  const { data } = await axios.get<GetBoardsCollaboratorResponse>(
    apiGetBoardsCollaborator
  );
  return data;
};

export default function useBoardsCollaborator(id: number) {
  return useQuery<GetBoardsCollaboratorResponse>(["BoardsCollaborator", id], () =>
    handleRequest(id)
  );
}
