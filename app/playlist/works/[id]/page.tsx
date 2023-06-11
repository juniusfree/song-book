"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const openAIAccessToken = localStorage.getItem("openAI");
const spotifyAccessToken = localStorage.getItem("spotify");

const getSpotifyRecommendations = async (key: string) => {
  const { data } = await fetch("http://localhost:3000/api/langchain", {
    method: "POST",
    body: JSON.stringify({
      worksKey: key,
      openAIAccessToken,
      spotifyAccessToken,
    }),
  }).then((res) => res.json());
  return data;
};

const useSpotifyRecommendations = (key: string) => {
  const [spotifyRecommendations, setSpotifyRecommendations] = useState({
    tracks: [],
    seeds: [],
  });

  const handleGetSpotifyRecommendations = async () => {
    const { data } = await fetch("http://localhost:3000/api/langchain", {
      method: "POST",
      body: JSON.stringify({
        worksKey: key,
        openAIAccessToken,
        spotifyAccessToken,
      }),
    }).then((res) => res.json());
    setSpotifyRecommendations(data);
  };

  useEffect(() => {
    handleGetSpotifyRecommendations();
  }, [key]);

  return { spotifyRecommendations, handleGetSpotifyRecommendations };
};

const getOpenLibraryWorks = async (key: string) => {
  const { data: works } = await fetch(
    "http://localhost:3000/api/openLibraryWorks",
    {
      method: "POST",
      body: JSON.stringify({ key: `works/${key}` }),
    }
  ).then((res) => res.json());
  return works;
};

const useOpenLibraryWorks = (key: string) => {
  const [openLibraryWorks, setOpenLibraryWorks] = useState();

  useEffect(() => {
    getOpenLibraryWorks(key).then((works) => {
      setOpenLibraryWorks(works);
    });
  }, [key]);

  return openLibraryWorks;
};

type Track = {
  external_urls: { spotify: string };
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string };
};

const PlaylistPage = ({ params }: { params: { id: string } }) => {
  const openLibraryWorks = useOpenLibraryWorks(params.id);
  const { covers, title, key, description, subtitle } = openLibraryWorks ?? {};
  const descriptionValue =
    typeof description === "object" ? description?.value : description;
  const cover = covers?.[0];

  const { spotifyRecommendations, handleGetSpotifyRecommendations } =
    useSpotifyRecommendations(params.id);
  const { tracks, seeds } = spotifyRecommendations;
  const genres = seeds.map(({ id }) => id).join(", ");

  const [showMoreDescription, setShowMoreDescription] = useState(false);

  return (
    <div className="relative">
      <div className="w-full flex justify-between p-5 gap-8 fixed bg-white shadow">
        <div className=" w-1/4 max-h-96 flex justify-center ">
          <div>
            {cover ? (
              <Image
                src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                width={200}
                height={200}
                alt={title}
                className="rounded outline-gray-50 outline"
              />
            ) : (
              <p className="w-72 h-72 flex items-center justify-center bg-gray-200 rounded text-3xl text-center py-2 text-gray-500">
                No Cover Image
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-3/4">
          <p className="text-4xl font-semibold">
            {title}
            {subtitle && `: ${subtitle}`}
          </p>
          <div className="flex flex-col">
            <p
              className={`overflow-hidden ${
                showMoreDescription ? "h-fit" : "h-10"
              } `}
            >
              {descriptionValue}
            </p>
            <button
              className="w-full text-left py-4 text-sm "
              onClick={() => setShowMoreDescription((prev) => !prev)}
            >
              {showMoreDescription ? "Show Less" : "Show More"}
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <p className="text-gray-500">Genres</p>
            <p className="font-medium">{genres}</p>
          </div>
          <button
            onClick={handleGetSpotifyRecommendations}
            className="bg-green-500 text-xs rounded-full p-2 text-white font-medium uppercase w-fit"
          >
            Get New Tracks
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-96 p-5">
        {tracks?.map((track: Track, index) => {
          const { external_urls, name, artists, album } = track;
          const albumCover = album.images[2]?.url;
          return (
            <div>
              <a
                href={external_urls?.spotify}
                target="_blank"
                className="flex items-center gap-4 w-full hover:bg-gray-100 p-2 rounded group/track"
              >
                <p className="w-4">{index + 1}</p>
                <div className="h-12 w-12">
                  {albumCover ? (
                    <Image
                      src={album.images[2]?.url}
                      width={64}
                      height={64}
                      alt={`${album.name}`}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-center py-2 text-gray-500">
                      No Cover Image
                    </div>
                  )}
                </div>
                <div className="text-sm w-5/12">
                  <p className="font-semibold">{name}</p>
                  <p className="text-gray-500 text-sm">
                    {artists.map(({ name }) => name).join(", ")}
                  </p>
                </div>
                <div className="text-sm text-gray-500 w-2/12">{album.name}</div>
                <div className="flex-grow flex justify-end items-center">
                  <button className="bg-green-500 text-xs rounded-full p-2 text-white font-medium uppercase hidden group-hover/track:block">
                    Play on Spotify
                  </button>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlaylistPage;
