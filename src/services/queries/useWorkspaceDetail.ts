import { useQuery } from "react-query";
import { GetWorkspaceDetailResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetWorkspaceDetail = qs.stringifyUrl({
    url: `workspace/${id}`,
  });
  const { data } = await axios.get<GetWorkspaceDetailResponse>(
    apiGetWorkspaceDetail
  );
  return data;
};

export default function useWorkspaceDetail(id: number) {
  return useQuery<GetWorkspaceDetailResponse>(
    ["WorkspaceDetail", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
