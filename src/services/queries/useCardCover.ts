import { useQuery } from "react-query";
import { GetCardCoverResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardCover = qs.stringifyUrl({
    url: `card/${id}/cover`,
  });
  const { data } = await axios.get<GetCardCoverResponse>(apiGetCardCover);
  return data;
};

export default function useCardCover(id: number) {
  return useQuery<GetCardCoverResponse>(
    ["CardCover", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
