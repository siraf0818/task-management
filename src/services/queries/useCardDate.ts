import { useQuery } from "react-query";
import { GetCardDateResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardDate = qs.stringifyUrl({
    url: `card/${id}/date`,
  });
  const { data } = await axios.get<GetCardDateResponse>(apiGetCardDate);
  return data;
};

export default function useCardDate(id: number) {
  return useQuery<GetCardDateResponse>(["CardDate", id], () =>
    handleRequest(id)
  );
}
