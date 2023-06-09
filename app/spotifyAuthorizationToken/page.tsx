"use client";

import { useSearchParams } from "next/navigation";

const SpotifyAuthorizationTokenPage = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  if (accessToken) {
    localStorage.setItem("spotify", accessToken as string);
    return <div>Success!</div>;
  }
  return <div>Something went wrong!</div>;
};

export default SpotifyAuthorizationTokenPage;
