import { useQuery } from "react-query";
import { GetWorkspaceResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetWorkspace = qs.stringifyUrl({
    url: "users/workspace",
  });
  const { data } = await axios.get<GetWorkspaceResponse>(apiGetWorkspace);
  return data;
};

export default function useWorkspace() {
  return useQuery<GetWorkspaceResponse>(["Workspace"], () => handleRequest());
}
