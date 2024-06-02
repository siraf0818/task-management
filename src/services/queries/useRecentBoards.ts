import { useQuery } from "react-query";
import { GetRecentBoardsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetRecentBoards = qs.stringifyUrl({
    url: "users/recent",
  });
  const { data } = await axios.get<GetRecentBoardsResponse>(apiGetRecentBoards);
  return data;
};

export default function useRecentBoards() {
  return useQuery<GetRecentBoardsResponse>(["RecentBoards"], () =>
    handleRequest()
  );
}
