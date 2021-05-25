import { css } from '@emotion/css';
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

export default function Home(): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <>
      <Head>
        <title>Connect Four</title>
        <meta name="description" content="Connect Four game" />
        {/* TODO: update favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={css`
          min-height: 100vh;
          display: grid;
          place-items: center;
        `}
      >
        <main
          className={css`
            padding: 20px;
          `}
        >
          <h1>Connect Four</h1>
          <div
            className={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            <div>
              {/* TODO: style player */}
              {state.isFull
                ? 'Game over!'
                : state.winner !== null
                ? `${Player[state.winner]} won!`
                : `${Player[state.turn]}’s turn`}
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
          </div>
          <div>
            {state.board.map((col, colIdx) => (
              <button
                key={colIdx}
                onClick={() =>
                  dispatch({
                    type: ActionType.Move,
                    colIdx,
                  })
                }
              >
                {[...Array(6).keys()].map((rowIdx) => (
                  <div key={rowIdx}>
                    {/* TODO: show game piece */}
                    {Player[state.board[colIdx][rowIdx]]}
                    <VisuallyHidden>
                      {Player[state.board[colIdx][rowIdx]]}
                    </VisuallyHidden>
                  </div>
                ))}
              </button>
            ))}
          </div>
        </main>

        <footer
          className={css`
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 20px;
            border-top: 1px solid #eaeaea;
            text-align: center;
          `}
        >
          <a
            href="https://github.com/leyanlo/connect-four"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/github.png" alt="GitHub Logo" width={40} height={40} />
          </a>
        </footer>
      </div>
    </>
  );
}
