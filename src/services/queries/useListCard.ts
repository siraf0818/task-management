import { useQuery } from "react-query";
import { GetListCardResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetListCard = qs.stringifyUrl({
    url: `list/${id}/cards`,
  });
  const { data } = await axios.get<GetListCardResponse>(apiGetListCard);
  return data;
};

export default function useListCard(id: number) {
  return useQuery<GetListCardResponse>(["ListCard", id], () =>
    handleRequest(id)
  );
}
