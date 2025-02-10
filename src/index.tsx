import clsx from 'clsx';
import { render } from 'preact';
import { useState } from 'preact/hooks';
import './style.css';

enum Removed {
  None = 0,
  Left = 0x01,
  Right = 0x02,
  Both = 0x03,
}
enum Side {
  Red = 0,
  Black = 1,
}

interface Piece {
  id: number;
  name: string;
}

enum SpecialPieces {
  Engineer = 1,
  Bomb = 0,
  Landmine = -1,
}

const pieces: Piece[] = [
  { id: 9, name: '司令' },
  { id: 8, name: '军长' },
  { id: 7, name: '师长' },
  { id: 6, name: '旅长' },
  { id: 5, name: '团长' },
  { id: 4, name: '营长' },
  { id: 3, name: '连长' },
  { id: 2, name: '排长' },
  { id: 1, name: '工兵' },
  { id: 0, name: '炸弹' },
  { id: -1, name: '地雷' },
];

export function App() {
  const [left, setLeft] = useState<Piece | null>();
  const [right, setRight] = useState<Piece | null>();
  const [removed, setRemoved] = useState(Removed.None);
  const [leftColor, setLeftColor] = useState(Side.Red);

  const compare = (l: Piece, r: Piece) => {
    if (l.id == SpecialPieces.Bomb || r.id == SpecialPieces.Bomb) {
      setRemoved(Removed.Both);
      return;
    }
    if (l.id == SpecialPieces.Landmine) {
      switch (r.id) {
        case SpecialPieces.Landmine:
          alert('选子无效，请重新选子。');
          return;
        case SpecialPieces.Engineer:
          setRemoved(Removed.Left);
          return;
        default:
          setRemoved(Removed.Right);
          return;
      }
    }
    if (r.id == SpecialPieces.Landmine) {
      switch (l.id) {
        case SpecialPieces.Engineer:
          setRemoved(Removed.Right);
          return;
        default:
          setRemoved(Removed.Left);
          return;
      }
    }

    if (l.id < r.id) {
      setRemoved(Removed.Left);
      return;
    }

    if (l.id > r.id) {
      setRemoved(Removed.Right);
      return;
    }
    setRemoved(Removed.Both);
  };

  return (
    <div class="board">
      <div class="header-left">
        <div class="placeholder">
          {left && (
            <div
              class={clsx(
                'piece',
                leftColor === Side.Red ? 'red' : 'black',
                (removed & Removed.Left) === 0 ? 'back' : 'removed'
              )}
            >
              {(removed & Removed.Left) > 0 && left.name}
            </div>
          )}
        </div>
      </div>
      <div class="header-right">
        <div class="placeholder">
          {right && (
            <div
              class={clsx(
                'piece',
                leftColor === Side.Black ? 'red' : 'black',
                (removed & Removed.Right) === 0 ? 'back' : 'removed'
              )}
            >
              {(removed & Removed.Right) > 0 && right.name}
            </div>
          )}
        </div>
      </div>
      <div class={clsx('left', leftColor === Side.Red ? 'red' : 'black')}>
        {pieces.map((p) => (
          <div
            class="piece"
            onClick={() => {
              setLeft(p);
              if ((removed & Removed.Right) > 0) {
                setRight(null);
              }
              setRemoved(Removed.None);
            }}
          >
            {p.name}
          </div>
        ))}
      </div>
      <div class="middle">
        <button
          class="button"
          disabled={left === null || right === null}
          onClick={() => compare(left, right)}
        >
          碰
        </button>
        <button
          class="button"
          onClick={() => {
            const temp = left;
            setLeft(right);
            setRight(temp);
            if (removed === Removed.Left || removed == Removed.Right) {
              setRemoved(3 - removed);
            }
            setLeftColor(1 - leftColor);
          }}
        >
          换边
        </button>
      </div>
      <div class={clsx('right', leftColor === Side.Black ? 'red' : 'black')}>
        {pieces.map((p) => (
          <div
            class="piece"
            onClick={() => {
              setRight(p);
              if ((removed & Removed.Left) > 0) {
                setLeft(null);
              }
              setRemoved(Removed.None);
            }}
          >
            {p.name}
          </div>
        ))}
      </div>
    </div>
  );
}

render(<App />, document.getElementById('app'));
