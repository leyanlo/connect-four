import { css, Global } from '@emotion/react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Global
        styles={css`
          html {
            box-sizing: border-box;
          }

          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }

          /* Focusing with a mouse, touch, or stylus will not show an outline. */
          :focus:not(:focus-visible) {
            outline: none;
          }
        `}
      />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
