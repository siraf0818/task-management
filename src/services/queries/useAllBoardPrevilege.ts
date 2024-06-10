import { useQuery } from "react-query";
import { GetAllBoardPrevilegeResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetAllBoardPrevilege = qs.stringifyUrl({
    url: `boards/previlege`,
  });
  const { data } = await axios.get<GetAllBoardPrevilegeResponse>(apiGetAllBoardPrevilege);
  return data;
};

export default function useAllBoardPrevilege() {
  return useQuery<GetAllBoardPrevilegeResponse>(["AllBoardPrevilege"], () => handleRequest());
}
