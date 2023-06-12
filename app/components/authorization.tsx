import { useCheckIfAuthorized } from "@/app/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

const decryptOpenAIkey = async (encryptedData: string) => {
  const { data } = await fetch("api/openAIAuthDecrypt", {
    method: "POST",
    body: JSON.stringify({ encryptedData }),
  }).then((res) => res.json());
  return data;
};

const useOpenAIKey = () => {
  const [openAIKey, setOpenAIKey] = useState("");
  const { openAIKey: localStorageOpenAIKey } = useCheckIfAuthorized();
  useEffect(() => {
    if (localStorageOpenAIKey) {
      decryptOpenAIkey(localStorageOpenAIKey).then((key) => {
        setOpenAIKey(key);
      });
    }
  }, [localStorageOpenAIKey]);
  return { openAIKey, setOpenAIKey };
};

const OpenAiAuthorizationComponent = () => {
  const { openAIKey, setOpenAIKey } = useOpenAIKey();
  const [savedOpenAIKey, setSavedOpenAIKey] = useState(false);
  return (
    <div className="w-full items-center flex flex-col gap-4">
      <p className="text-sm font-bold uppercase text-gray-500">
        OpenAI API Key
      </p>
      <input
        type="text"
        value={openAIKey}
        onChange={(e) => setOpenAIKey(e.target.value)}
        placeholder="OpenAI Key"
        className="w-full h-8 outline outline-1 outline-gray-200 rounded px-2 py-4"
      />
      <button
        disabled={!openAIKey}
        className={`w-80 rounded-full bg-gray-500 p-2 text-white text-center disabled:bg-gray-200`}
        onClick={async () => {
          await fetch("api/openAIAuthEncrypt", {
            method: "POST",
            body: JSON.stringify({ apiKey: openAIKey }),
          })
            .then(async (res) => {
              const { data } = await res.json();
              localStorage.setItem("openAI", data);
              setSavedOpenAIKey(true);
            })
            .catch((err) => console.log(err));
        }}
      >
        {savedOpenAIKey ? "Saved" : "Save OpenAI Key"}
      </button>
    </div>
  );
};

const SpotifyAuthorizationButton = () => {
  const { spotifyKey } = useCheckIfAuthorized();
  return (
    <div className="flex flex-col gap-4 items-center">
      <p className="text-sm font-bold uppercase text-gray-500">
        Spotify Authorization
      </p>
      <div className="mx-auto w-80 rounded-full bg-green-500 p-2 text-white text-center">
        <Link href="api/spotifyAuthorization" target="_blank">
          {spotifyKey ? "Re-authorize" : "Authorize"} access to Spotify
        </Link>
      </div>
    </div>
  );
};

const AuthorizationComponent = ({
  handleOnClose,
}: {
  handleOnClose: () => void;
}) => {
  return (
    <div className="w-full flex flex-col gap-8">
      <OpenAiAuthorizationComponent />
      <hr className="w-1/2 mx-auto" />
      <SpotifyAuthorizationButton />
      <button
        className="outline-gray-500 outline rounded-full p-2"
        onClick={handleOnClose}
      >
        Close
      </button>
    </div>
  );
};

export default AuthorizationComponent;
