import { useQuery } from "react-query";
import { GetWorkspaceTypesResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetWorkspaceTypes = qs.stringifyUrl({
    url: `workspace/types`,
  });
  const { data } = await axios.get<GetWorkspaceTypesResponse>(
    apiGetWorkspaceTypes
  );
  return data;
};

export default function useWorkspaceTypes() {
  return useQuery<GetWorkspaceTypesResponse>(["WorkspaceTypes"], () =>
    handleRequest()
  );
}
