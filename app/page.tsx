"use client";

import React from "react";

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
    <div>
      <input
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
      </a>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full h-8"
      />
      <button onClick={handleOnSearch}>Click me</button>
      <ul>
        {searchResult?.map((doc: any) => {
          return (
            <li key={doc.key} onClick={() => handleSelectBook(doc.key)}>
              <p>{doc.title}</p>
            </li>
          );
        })}
      </ul>
      <hr />
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
