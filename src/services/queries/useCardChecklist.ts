import { useQuery } from "react-query";
import { GetCardChecklistResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardChecklist = qs.stringifyUrl({
    url: `card/${id}/checklist`,
  });
  const { data } = await axios.get<GetCardChecklistResponse>(
    apiGetCardChecklist
  );
  return data;
};

export default function useCardChecklist(id: number) {
  return useQuery<GetCardChecklistResponse>(["CardChecklist", id], () =>
    handleRequest(id)
  );
}
