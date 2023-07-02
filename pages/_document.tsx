import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="description" content="See my photos around the world." />
          <meta property="og:site_name" content="photos.willianjusten.com.br" />
          <meta
            property="og:description"
            content="See my photos around the world."
          />
          <meta property="og:title" content="Willian Justen - Photography" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Willian Justen - Photography" />
          <meta
            name="twitter:description"
            content="See my photos around the world."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
