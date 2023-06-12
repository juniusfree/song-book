import Image from "next/image";
import Link from "next/link";

type Book = {
  covers: number[];
  title: string;
  key: string;
  description: { value: string } | string;
};

const BookListComponent = ({
  books,
  searchValue,
}: {
  books: Book[];
  searchValue?: string | null;
}) => {
  return (
    <ul>
      {books?.map((doc: Book, index: number) => {
        const { covers, title, key, description } = doc;
        const descriptionValue =
          typeof description === "object" ? description?.value : description;
        const cover = covers?.[0];
        return (
          <Link href={`/playlist/${key}?searchValue=${searchValue}`}>
            <li
              key={key}
              className="flex items-center gap-4 px-5 py-12 h-12 hover:bg-gray-100 cursor-pointer"
            >
              <p className="w-4 text-gray-500">{index + 1}</p>
              <div className="w-12 min-w-12 flex justify-center items-center">
                {cover ? (
                  <Image
                    src={`https://covers.openlibrary.org/b/id/${cover}-M.jpg`}
                    width={48}
                    height={48}
                    alt={title}
                    className="rounded outline-gray-50 outline"
                  />
                ) : (
                  <p className="w-12 bg-gray-200 rounded text-xs text-center py-2 text-gray-500">
                    No Cover Image
                  </p>
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <p className="font-semibold">{title}</p>
                <p className="text-ellipsis text-xs text-gray-500">
                  {descriptionValue.slice(0, 300)}...
                </p>
              </div>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default BookListComponent;
