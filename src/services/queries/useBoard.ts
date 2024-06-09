import { useQuery } from "react-query";
import { GetBoardResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetBoard = qs.stringifyUrl({
    url: `boards/${id}`,
  });
  const { data } = await axios.get<GetBoardResponse>(apiGetBoard);
  return data;
};

export default function useBoard(id: number) {
  return useQuery<GetBoardResponse>(["Board", id], () => handleRequest(id));
}
