import { useQuery } from "react-query";
import { GetBoardListResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetBoardList = qs.stringifyUrl({
    url: `boards/${id}/list`,
  });
  const { data } = await axios.get<GetBoardListResponse>(apiGetBoardList);
  return data;
};

export default function useBoardList(id: number) {
  return useQuery<GetBoardListResponse>(["BoardList", id], () =>
    handleRequest(id)
  );
}
