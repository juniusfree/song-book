"use client";

import { useSearchParams, useRouter } from "next/navigation";

const SpotifyAuthorizationTokenPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = searchParams.get("access_token");
  if (accessToken) {
    sessionStorage.setItem("spotify", accessToken as string);
    router.push("/");
  }
  router.push("/");
};

export default SpotifyAuthorizationTokenPage;
