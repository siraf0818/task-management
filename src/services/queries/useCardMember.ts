import { useQuery } from "react-query";
import { GetCardMemberResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async (id: number) => {
  const apiGetCardMember = qs.stringifyUrl({
    url: `card/${id}/member`,
  });
  const { data } = await axios.get<GetCardMemberResponse>(apiGetCardMember);
  return data;
};

export default function useCardMember(id: number) {
  return useQuery<GetCardMemberResponse>(
    ["CardMember", id],
    () => handleRequest(id),
    {
      enabled: !!id,
    }
  );
}
