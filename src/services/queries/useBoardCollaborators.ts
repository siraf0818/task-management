import { useQuery } from "react-query";
import { GetBoardCollaboratorsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetBoardCollaborators = qs.stringifyUrl({
    url: `boards/${id}/collaborator`,
  });
  const { data } = await axios.get<GetBoardCollaboratorsResponse>(
    apiGetBoardCollaborators
  );
  return data;
};

export default function useBoardCollaborators(id: number) {
  return useQuery<GetBoardCollaboratorsResponse>(
    ["BoardCollaborators", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
