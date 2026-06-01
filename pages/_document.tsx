import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <title>Connect Four</title>
          <meta content="Connect Four game" name="description" />
          <link href="/favicon.ico" rel="icon" />
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token":"93030ac6453e41e6828a7ddcf48c8f8b"}'
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
