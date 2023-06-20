export const rootURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://juniusfree-song-book.vercel.app";

export const getBookDescriptionValue = (
  description:
    | string
    | {
        value: string;
        [key: string]: any;
      }
) => {
  if (typeof description === "string") return description;
  return description?.value;
};