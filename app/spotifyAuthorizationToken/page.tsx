"use client";

import { useSearchParamsValue } from "@/app/hooks";

const SpotifyAuthorizationTokenPage = () => {
  const accessToken = useSearchParamsValue("access_token");
  if (accessToken) {
    localStorage.setItem("spotify", accessToken as string);
    return <div>Success!</div>;
  }
  return <div>Something went wrong!</div>;
};

export default SpotifyAuthorizationTokenPage;
