// import { AnyAaaaRecord } from 'dns';
import React from 'react';
import ReactDOM from 'react-dom';
// import { setConstantValue } from 'typescript';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * @interface Shape of Square.props
 * 
 * @property {string} value 
 *    The value of the square, either 'X', 'O', or null.
 * @property {() => void}
 *    Function that calls the handleClick function in class Game when a square is clicked.
 */

interface SquareProp {
  value: string;
  onClick: () => void;
}

function Square(props: SquareProp) {
  return (
    <button className={"square"} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/**
 * @interface Shape of Board.props
 * 
 * @property {Array<string>} squares
 *    Array containing the values of each square on the board.
 * @property {(i:number) => void}
 *    Function that calls the handleClick function in class Game when a square is clicked.
 */

interface BoardProp {
  squares: Array<string>;
  onClick: (i:number) => void;
}

class Board extends React.Component<BoardProp> {
  renderSquare(i: number) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      /> 
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

/**
 * @interface Shape of Game.state
 * 
 * @property {Array<SquaresState} history
 *    Array of arrays containing the entire history of the game, i.e. the state of the board at every turn.
 * @property {Boolean} xIsNext
 *    Boolean that takes on true when it's X's turn to go next, false otherwise.
 * @property {number} stepNumber 
 *    Number that keeps track of how many turns have been played in the game so far.
 */

interface GameState {
  history: Array<SquaresState>;
  xIsNext: Boolean;
  stepNumber: number;
}

/**
 * @interface Shape of SquareState which is a type used in GameState
 * 
 * @property {Array<string>} squares
 *    Array containing the values of the squares at a given moment
 */

interface SquaresState {
  squares: Array<string>;
}

class Game extends React.Component<{}, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const nextState = current.squares.slice();
    if (nextState[i] || checkWinner(current.squares)) {
      return;
    }

    nextState[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: nextState}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    })
  }

  jumpStep(step: number) {
    this.setState({
      history: this.state.history,
      xIsNext: (step % 2) === 0,
      stepNumber: step,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const moves = history.map((one, index) => {
      const desc = 'Go to move ' + index;
      return (
        <li key={index}>
          <button onClick={() => this.jumpStep(index)}>
            {desc}
          </button>
        </li>
        )
      }
    );

    let status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    let winner = checkWinner(current.squares);
    if (winner) {
      status = 'Player ' + winner + ' wins!'
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares} 
            onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{moves}</div>
        </div>
      </div>
    );
  }
}

function checkWinner(squares: Array<string>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;

}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
