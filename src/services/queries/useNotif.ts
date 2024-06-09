import { useQuery } from "react-query";
import { GetNotificationsResponse } from "../../constants/types";
import axios from "../axios";
import qs from "query-string";

const handleRequest = async () => {
  const apiGetNotifications = qs.stringifyUrl({
    url: `users/notification`,
  });
  const { data } = await axios.get<GetNotificationsResponse>(
    apiGetNotifications
  );
  return data;
};

export default function useNotifications() {
  return useQuery<GetNotificationsResponse>(["Notifications"], () =>
    handleRequest()
  );
}
