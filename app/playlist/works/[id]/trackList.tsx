import Image from "next/image";

type Track = {
  external_urls: { spotify: string };
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[]; name: string };
};

export const TrackListComponent = ({ tracks }: { tracks: Track[] }) => {
  return (
    <>
      {tracks?.map((track: Track, index: number) => {
        const { external_urls, name, artists, album } = track;
        const albumCover = album.images[2]?.url;
        const albumName = album.name;
        const namesOfArtists = artists.map(({ name }) => name).join(", ");
        return (
          <div key={artists + name + albumName}>
            <a
              href={external_urls?.spotify}
              target="_blank"
              className="flex items-center gap-4 w-full hover:bg-gray-100 p-2 rounded group/track"
            >
              <p className="w-4 text-gray-500">{index + 1}</p>
              <div className="h-12 w-12">
                {albumCover ? (
                  <Image
                    src={albumCover}
                    width={64}
                    height={64}
                    alt={`${albumName}`}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-center py-2 text-gray-500">
                    No Cover Image
                  </div>
                )}
              </div>
              <div className="text-sm w-5/12">
                <p className="font-semibold">{name}</p>
                <p className="text-gray-500 text-sm">{namesOfArtists}</p>
              </div>
              <div className="text-sm text-gray-500 w-2/12">{albumName}</div>
              <div className="flex-grow flex justify-end items-center">
                <button className="bg-green-500 text-xs rounded-full p-2 text-white font-medium uppercase hidden group-hover/track:block">
                  Play on Spotify
                </button>
              </div>
            </a>
          </div>
        );
      })}
    </>
  );
};
