"use client";

import { useCheckIfAuthorized, useSearchParamsValue } from "@/app/hooks";
import ArrowLeftIcon from "@heroicons/react/20/solid/ArrowLeftIcon";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { TrackListComponent } from "./trackList";

const useSpotifyRecommendations = (key: string | null, count: number) => {
  const { openAIKey, spotifyKey } = useCheckIfAuthorized();
  const getSpotifyRecommendations = ([url, key, _count, openAI, spotify]: [
    string,
    string,
    number,
    string,
    string
  ]) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        worksKey: key,
        openAIAccessToken: openAI,
        spotifyAccessToken: spotify,
      }),
    })
      .then((res) => res.json())
      ?.then((res) => res.data);

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/langchain", key, count, openAIKey, spotifyKey],
    getSpotifyRecommendations,
    {
      revalidateOnFocus: false,
    }
  );
  return { data, error, isLoading, mutate };
};

const useOpenLibraryWorks = (key: string) => {
  const getOpenLibraryWorks = ([url, key]: string[]) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ key: `works/${key}` }),
    })
      .then((res) => res.json())
      ?.then((res) => res.data);

  const { data, error, isLoading } = useSWR(
    ["/api/openLibraryWorks", key],
    getOpenLibraryWorks,
    {
      revalidateOnFocus: false,
    }
  );
  return { data, error, isLoading };
};

type Track = {
  external_urls: { spotify: string };
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string };
};

const PlaylistPage = ({ params }: { params: { id: string } }) => {
  const searchValue = useSearchParamsValue("searchValue");
  const { data, isLoading } = useOpenLibraryWorks(params.id);
  const { covers, title, description, subtitle } = data ?? {};
  const descriptionValue =
    typeof description === "object" ? description?.value : description;
  const cover = covers?.[0];
  const [showMoreDescription, setShowMoreDescription] = useState(false);

  const [refreshCount, setRefreshCount] = useState(0);
  const {
    data: spotifyRecommendations,
    isLoading: isLoadingSpotifyRecommendations,
  } = useSpotifyRecommendations(params.id, refreshCount);
  const handleGetSpotifyRecommendations = async () => {
    setRefreshCount((prev) => prev + 1);
  };

  const { tracks, seeds } = spotifyRecommendations ?? {};
  const genres = seeds?.map(({ id }: { id: string }) => id).join(", ");

  if (isLoading) return null;

  return (
    <div className="relative">
      <div className="fixed w-full bg-white shadow">
        <Link
          href={`/?searchValue=${searchValue}`}
          className=" bg-white w-full h-10"
        >
          <div className="px-5 py-4 items-center flex gap-2">
            <ArrowLeftIcon className="w-5 h-5" /> Back
          </div>
        </Link>
        <div className="w-full flex justify-between p-5 gap-8 bg-white">
          <div className=" w-1/4 max-h-96 flex justify-center ">
            <div>
              {cover ? (
                <Image
                  src={`https://covers.openlibrary.org/b/id/${cover}-L.jpg`}
                  width={150}
                  height={150}
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
              <p className="font-medium">
                {isLoadingSpotifyRecommendations && "Loading the genres..."}
                {!isLoadingSpotifyRecommendations &&
                  !spotifyRecommendations?.error &&
                  genres}
                {spotifyRecommendations?.error && "Something went wrong"}
              </p>
            </div>
            <button
              onClick={handleGetSpotifyRecommendations}
              className="bg-green-500 text-xs rounded-full p-2 text-white font-medium uppercase w-fit"
            >
              Get New Tracks
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-96 p-5">
        {isLoadingSpotifyRecommendations && (
          <p className="h-full w-full flex items-center justify-center font-medium text-gray-400">
            Loading the tracks...
          </p>
        )}
        {!isLoading && spotifyRecommendations?.error && (
          <div className="flex flex-col gap-2 font-medium text-gray-400 items-center justify-center">
            <p>
              Cannot find any tracks of{" "}
              <span className="italic font-bold">{title}</span>
            </p>
            <p>Please check if OpenAI and Spotify keys are set.</p>
          </div>
        )}
        {!isLoading && <TrackListComponent tracks={tracks} />}
      </div>
    </div>
  );
};

export default PlaylistPage;
