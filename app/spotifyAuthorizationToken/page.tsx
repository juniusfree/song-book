"use client";

import { useSearchParams } from "next/navigation";

const SpotifyAuthorizationTokenPage = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access_token");
  if (accessToken) {
    localStorage.setItem("spotify", accessToken as string);
  }
  window.close();
};

export default SpotifyAuthorizationTokenPage;
