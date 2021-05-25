/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import clone from 'just-clone';
import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';

const VisuallyHidden = styled.div`
  &:not(:focus):not(:active) {
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;

const DIRS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

enum Player {
  Red,
  Yellow,
}

type State = {
  board: Player[][];
  turn: Player;
  winner: Player | null;
  isFull: boolean;
};

const initialState: State = {
  board: [...Array(7)].map(() => []),
  turn: Player.Red,
  winner: null,
  isFull: false,
};

enum ActionType {
  Move,
  Reset,
}

type Action =
  | {
      type: ActionType.Move;
      colIdx: number;
    }
  | {
      type: ActionType.Reset;
    };

function getWinner(board: Player[][]): Player | null {
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 6; row++) {
      const player = board[col][row];
      if (player !== undefined) {
        dirLoop: for (const dir of DIRS) {
          let col2 = col;
          let row2 = row;
          for (let i = 0; i < 3; i++) {
            col2 += dir[0];
            row2 += dir[1];
            if (board[col2]?.[row2] !== player) {
              // not 4 in a row
              continue dirLoop;
            }
          }
          // 4 in row found
          return player;
        }
      }
    }
  }
  return null;
}

function reducer(state: State, action: Action) {
  let nextState;
  switch (action.type) {
    case ActionType.Move:
      if (state.winner !== null || state.board[action.colIdx].length === 6) {
        // noop if game over or column full
        nextState = state;
        break;
      }

      nextState = clone(state);
      nextState.board[action.colIdx].push(state.turn);
      nextState.turn = (state.turn + 1) % 2;
      nextState.winner = getWinner(nextState.board);
      nextState.isFull = nextState.board.flat().length === 7 * 6;
      break;

    case ActionType.Reset:
      nextState = initialState;
      break;
  }
  return nextState;
}

function PlayerName({ player }: { player: Player }) {
  return (
    <b
      css={css`
        color: ${{
          [Player.Red]: '#CD1D30',
          [Player.Yellow]: '#FBC809',
        }[player]};
      `}
    >
      {Player[player]}
    </b>
  );
}

export default function Home(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <>
      <Head>
        <title>Connect Four</title>
        <meta content="Connect Four game" name="description" />
        {/* TODO: update favicon */}
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main
        css={css`
          padding: 40px 0;
          width: 350px;
          margin: auto;
        `}
      >
        <h1
          css={css`
            text-align: center;
          `}
        >
          Connect Four
        </h1>
        <p
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <div>
            {state.isFull ? (
              'Game over!'
            ) : state.winner !== null ? (
              <>
                <PlayerName player={state.winner} /> won!
              </>
            ) : (
              <>
                <PlayerName player={state.turn} />
                ’s turn
              </>
            )}
          </div>
          <button
            onClick={() =>
              dispatch({
                type: ActionType.Reset,
              })
            }
          >
            New Game
          </button>
        </p>
        <section
          css={css`
            display: flex;
            padding-top: 50px;
          `}
        >
          {state.board.map((col, colIdx) => (
            <button
              key={colIdx}
              css={css`
                border: none;
                padding: 0;
                background: #1d63f2;
                width: 50px;
                height: 300px;
                display: flex;
                flex-direction: column-reverse;
              `}
              onClick={() =>
                dispatch({
                  type: ActionType.Move,
                  colIdx,
                })
              }
            >
              {[...Array(6).keys()].map((rowIdx) => (
                <div
                  key={rowIdx}
                  css={css`
                    width: 36px;
                    height: 36px;
                    margin: auto;
                    border-radius: 50%;
                    background: white;
                  `}
                >
                  {/* TODO: show game piece */}
                  {Player[state.board[colIdx][rowIdx]]}
                  <VisuallyHidden>
                    {Player[state.board[colIdx][rowIdx]]}
                  </VisuallyHidden>
                </div>
              ))}
            </button>
          ))}
        </section>
      </main>

      <footer
        css={css`
          position: fixed;
          bottom: 0;
          width: 100%;
          padding: 20px;
          border-top: 1px solid #eaeaea;
          text-align: center;
        `}
      >
        <a
          href="https://github.com/leyanlo/connect-four"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image alt="GitHub Logo" height={40} src="/github.png" width={40} />
        </a>
      </footer>
    </>
  );
}
