import { useQuery } from "react-query";
import { GetCardActivityResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardActivity = qs.stringifyUrl({
    url: `card/${id}/activity`,
  });
  const { data } = await axios.get<GetCardActivityResponse>(apiGetCardActivity);
  return data;
};

export default function useCardActivity(id: number) {
  return useQuery<GetCardActivityResponse>(
    ["CardActivity", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
