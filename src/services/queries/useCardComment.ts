import { useQuery } from "react-query";
import { GetCardCommentResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardComment = qs.stringifyUrl({
    url: `card/${id}/comment`,
  });
  const { data } = await axios.get<GetCardCommentResponse>(apiGetCardComment);
  return data;
};

export default function useCardComment(id: number) {
  return useQuery<GetCardCommentResponse>(["CardComment", id], () =>
    handleRequest(id)
  );
}
