"use client";

import Cog6ToothIcon from "@heroicons/react/20/solid/Cog6ToothIcon";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import { useEffect, useState } from "react";
import AuthorizationComponent from "./components/authorization";
import BookListComponent from "./components/bookList";

const isAuthorized =
  localStorage.getItem("openAI") && localStorage.getItem("spotify");

const useShowAuth = () => {
  const [showAuth, setShowAuth] = useState(false);
  useEffect(() => {
    if (!isAuthorized) {
      setShowAuth(true);
    }
  }, []);
  return { showAuth, setShowAuth };
};

const Home = () => {
  const [spotifyTrack, setSpotifyTrack] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { showAuth, setShowAuth } = useShowAuth();

  const handleOnSearch = async () => {
    setSearchResult([]);
    setSpotifyTrack([]);
    const { data } = await fetch("api/openLibrarySearch", {
      method: "POST",
      body: JSON.stringify({ query: searchInput }),
    }).then((res) => res.json());
    setSearchResult(data);
  };

  const handleSelectBook = async (key: string) => {
    const { data: works } = await fetch("api/openLibraryWorks", {
      method: "POST",
      body: JSON.stringify({ key }),
    }).then((res) => res.json());
    const langChainResponse = await fetch("api/langchain", {
      method: "POST",
      body: JSON.stringify({
        works,
        openAIAccessToken: localStorage.getItem("openAI"),
        spotifyAccessToken: localStorage.getItem("spotify"),
      }),
    }).then((res) => res.json());
    setSpotifyTrack(langChainResponse?.data?.tracks);
  };

  return (
    <div className="w-full relative">
      {showAuth && (
        <div className="absolute z-30 inset-0  bg-opacity-50 h-screen flex items-center justify-center">
          <div className="flex flex-col gap-8 w-96 p-8 h-fit shadow-lg outline outline-gray-50 rounded-lg bg-white">
            <AuthorizationComponent
              handleOnClose={() => {
                setShowAuth((prev) => !prev);
                if (!isAuthorized) {
                  window.location.reload();
                }
              }}
            />
          </div>
        </div>
      )}
      <div className="z-20 w-full flex flex-col items-center justify-center  h-fit fixed">
        <div className="w-full flex flex-col gap-1 h-48 bg-gradient-to-r from-white to-gray-300 justify-between p-5">
          <div className="flex flex-col justify-center flex-grow">
            <p className="text-3xl font-bold">SongBook</p>
            <p> Find songs that matches the mood of a book</p>
          </div>
          <button
            className="flex items-center text-xs self-end justify-end gap-1 font-medium uppercase text-gray-500 rounded-full"
            onClick={() => setShowAuth((prev) => !prev)}
          >
            <Cog6ToothIcon className="w-4 h-4" />
            Authorization Settings
          </button>
        </div>

        <div
          className={`flex gap-2 outline outline-none w-full py-4 px-5 bg-white shadow items-center ${
            !isAuthorized && "bg-gray-100"
          }`}
        >
          <button onClick={handleOnSearch}>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          </button>
          <input
            disabled={!isAuthorized}
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            className={`w-full h-8 outline-none disabled:bg-gray-100`}
            placeholder={
              isAuthorized ? "Search for a book" : "Authorize to search"
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOnSearch();
              }
            }}
          />
        </div>
      </div>

      <div className="pt-72 ">
        {isAuthorized && <BookListComponent books={searchResult} />}
      </div>
      {spotifyTrack?.map(
        (track: { external_urls: { spotify: string }; name: string }) => {
          return (
            <div>
              <a href={track?.external_urls?.spotify} target="_blank">
                {track?.name}
              </a>
            </div>
          );
        }
      )}
    </div>
  );
};

export default Home;
