import { AnyAaaaRecord } from 'dns';
import React from 'react';
import ReactDOM from 'react-dom';
import { setConstantValue } from 'typescript';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
// implement winner and have game messasges for who's turn and if somoene's won
// implement time travel 

interface SquareProp {
  value: string;
  onClick: () => void;
}

class Square extends React.Component<SquareProp> {
  render() {
    return (
      <button className={"square"} onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

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

interface SquaresState {
  squares: Array<string>;
}

interface GameState {
  history: Array<SquaresState>;
  xIsNext: Boolean;
  turnNumber: number;
}

class Game extends React.Component<{}, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      turnNumber: 0,
    }
  }

  handleClick(i: number) {
    const history = this.state.history;
    const current = history[history.length - 1]
    const nextState = current.squares.slice()
    if (nextState[i]) {
      return;
    }
    if (this.state.turnNumber % 2 === 0) {
      nextState[i] = 'X';
    } else {
      nextState[i] = 'O';
    }
    this.setState({
      history: history.concat([{squares: nextState}]),
      xIsNext: !this.state.xIsNext,
      turnNumber: this.state.turnNumber + 1,
    })
  }
  render() {
    const history = this.state.history;
    const current = history[history.length - 1]
    return (
      <Board 
        squares={current.squares} 
        onClick={(i) => this.handleClick(i)} 
      />
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
