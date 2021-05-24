import { css } from '@emotion/css';
import Head from 'next/head';

export default function Home(): JSX.Element {
  return (
    <div
      className={css`
        min-height: 100vh;
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      `}
    >
      <Head>
        <title>Connect Four</title>
        <meta name="description" content="Connect Four game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={css`
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <h1>Connect Four</h1>
        Red’s turn <button>New Game</button>
        <div>TODO: Board</div>
      </main>
    </div>
  );
}
