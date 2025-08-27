import "../styles/globals.css";
import { Providers } from './providers'

export const metadata = {
  title: "Omani Traditional Clothing Generator",
  description: "Generate authentic Omani traditional clothing images using AI",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}