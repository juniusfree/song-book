import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: "SongBook",
  description: "Find music that matches the mood of a book",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="md:hidden p-4">
          <p className="text-gray-700">
            Sorry! This application is not supported on mobile devices. Please
            use a desktop browser.
          </p>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
        </div>

        <div className="hidden md:block">{children}</div>
      </body>
    </html>
  );
}
