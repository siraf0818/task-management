import { useQuery } from "react-query";
import { GetCardLabelResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardLabel = qs.stringifyUrl({
    url: `card/${id}/label`,
  });
  const { data } = await axios.get<GetCardLabelResponse>(apiGetCardLabel);
  return data;
};

export default function useCardLabel(id: number) {
  return useQuery<GetCardLabelResponse>(["CardLabel", id], () =>
    handleRequest(id)
  );
}
