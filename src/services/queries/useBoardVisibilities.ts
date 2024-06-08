import { useQuery } from "react-query";
import { GetBoardVisibilitiesResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetBoardVisibilities = qs.stringifyUrl({
    url: `boards/visibility`,
  });
  const { data } = await axios.get<GetBoardVisibilitiesResponse>(
    apiGetBoardVisibilities
  );
  return data;
};

export default function useBoardVisibilities() {
  return useQuery<GetBoardVisibilitiesResponse>(["BoardVisibilities"], () =>
    handleRequest()
  );
}
