import { useQuery } from "react-query";
<<<<<<< Updated upstream
import { GetRecentBoardsResponse } from "../../constants/types";
=======
import { GetStarredBoardsResponse } from "../../constants/types";
>>>>>>> Stashed changes
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetStarredBoards = qs.stringifyUrl({
    url: "users/starred",
  });
<<<<<<< Updated upstream
  const { data } = await axios.get<GetRecentBoardsResponse>(
    apiGetStarredBoards
  );
=======
  const { data } = await axios.get<GetStarredBoardsResponse>(apiGetStarredBoards);
>>>>>>> Stashed changes
  return data;
};

export default function useStarredBoards() {
<<<<<<< Updated upstream
  return useQuery<GetRecentBoardsResponse>(["StarredBoards"], () =>
=======
  return useQuery<GetStarredBoardsResponse>(["StarredBoards"], () =>
>>>>>>> Stashed changes
    handleRequest()
  );
}
