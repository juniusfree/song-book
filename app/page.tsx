"use client";

import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";
import React from "react";
import BookListComponent from "./components/bookList";

const Home = () => {
  const [spotifyTrack, setSpotifyTrack] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [searchResult, setSearchResult] = React.useState([]);
  const [openAIKey, setOpenAIKey] = React.useState("");

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
      {/* <input
        type="text"
        value={openAIKey}
        onChange={(e) => setOpenAIKey(e.target.value)}
        className="w-full h-8"
      />
      <button
        onClick={async () => {
          const { data } = await fetch("api/openAIAuthEncrypt", {
            method: "POST",
            body: JSON.stringify({ apiKey: openAIKey }),
          })
            .then((res) => res.json())
            .catch((err) => console.log(err));
          localStorage.setItem("openAI", data);
        }}
      >
        Click me
      </button>
      <a href="http://localhost:3000/api/spotifyAuthorization" target="_blank">
        spotify
      </a> */}
      <div className="z-20 w-full flex flex-col items-center justify-center  h-fit fixed">
        <div className="w-full flex flex-col gap-1 h-48 bg-gradient-to-r from-white to-gray-300 justify-center p-5">
          <p className="text-3xl font-bold">SongBook</p>
          <p> Find songs that matches the mood of a book</p>
        </div>
        <div className="flex gap-2 outline outline-none w-full py-4 px-5 bg-white shadow items-center">
          <button onClick={handleOnSearch}>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          </button>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            className="w-full h-8 outline-none"
            placeholder="Search for a book"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleOnSearch();
              }
            }}
          />
        </div>
      </div>

      <div className="pt-72">
        <BookListComponent books={searchResult} />
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
