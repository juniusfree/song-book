import { useEffect, useState } from "react";

export const useCheckIfAuthorized = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [openAIKey, setOpenAIKey] = useState<string | null>(null);
  const [spotifyKey, setSpotifyKey] = useState<string | null>(null);
  useEffect(() => {
    const openAIKey = localStorage.getItem("openAI");
    const spotifyKey = localStorage.getItem("spotify");
    setOpenAIKey(openAIKey);
    setSpotifyKey(spotifyKey);
    if (openAIKey && spotifyKey) {
      setIsAuthorized(true);
    }
  }, []);
  return { isAuthorized, openAIKey, spotifyKey };
};
