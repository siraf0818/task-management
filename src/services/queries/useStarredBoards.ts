import { useQuery } from "react-query";
import { GetRecentBoardsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetStarredBoards = qs.stringifyUrl({
    url: "users/starred",
  });
  const { data } = await axios.get<GetRecentBoardsResponse>(
    apiGetStarredBoards
  );
  return data;
};

export default function useStarredBoards() {
  return useQuery<GetRecentBoardsResponse>(["StarredBoards"], () =>
    handleRequest()
  );
}
