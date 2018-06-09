import React, { Component } from 'react';
import Cell from './Cell.jsx';
import './Board.css';

class Board extends Component {
  constructor(props) {
    super(props);

    this.state = {
      board: [],
      visuals: [],
      isGameOver: false,
      isWon: false,
      isRunning: false,
      timer: 0,
    }
    this.handleClick = this.handleClick.bind(this);
    this.revealAllBombs = this.revealAllBombs.bind(this);
    this.handleWin = this.handleWin.bind(this);
    this.handleGameStart = this.handleGameStart.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  componentWillMount() {
    this.initializeGame();
  }

  initializeGame = () => {
    let board = [];
    let visuals = [];
    for (let i = 1; i <= 10; i++) {
      let row = []
      for(let j = 1; j <= 10; j++) {
        row.push(100);
      }
      visuals.push([...row]);
      board.push(row);
    }
    let mineCounter = 0;
    while(mineCounter !== 10) {
      let x = (Math.floor(Math.random()*(10)+1)) - 1;
      let y = (Math.floor(Math.random()*(10)+1)) - 1;
      if(board[x][y] !== 66) {
        board[x][y] = 66;
        mineCounter++;
      }
    }
    for(let a = 0; a < 10; a ++) {
      for(let b = 0; b < 10; b ++) {
        if(board[a][b] === 66) {
          if(board[a+1] && board[a+1][b-1] && board[a+1][b-1] !== 66) {board[a+1][b-1]+=1};
          if(board[a][b+1] && board[a][b+1] !== 66) {board[a][b+1]+=1};
          if(board[a+1] && board[a+1][b] && board[a+1] !== 66) {board[a+1][b]+=1};
          if(board[a+1] && board[a+1][b+1] && board[a+1][b+1] !== 66) {board[a+1][b+1]+=1};
          if(board[a-1] && board[a-1][b-1] && board[a-1][b-1] !== 66) {board[a-1][b-1]+=1};
          if(board[a-1] && board[a-1][b] && board[a-1][b] !== 66) {board[a-1][b]+=1};
          if(board[a][b-1] && board[a][b-1] !== 66) {board[a][b-1]+=1};
          if(board[a-1] && board[a-1][b+1] && board[a-1][b+1] !== 66) {board[a-1][b+1]+=1};
        }
      } 
    }
    this.setState({
      board: board,
      visuals: visuals,
      isGameOver: false,
      isWon: false,
      timer: 0,
    });
  }

  startTimer() {
    let currentTime = this.state.timer;
    let timerID;
    timerID = setInterval(() => {
      if(!this.state.isRunning){
        clearInterval(timerID);
      }else {
       this.setState({
         timer: currentTime++,
       })
      }
    }, 1000);
  }

  handleClick(rowIndex, colIndex) {
    if(!this.state.isRunning){
      return;
    }
    let visuals = [...this.state.visuals];
    if (this.state.board[rowIndex][colIndex] === 66 && !this.state.isGameOver) {
        this.revealAllBombs();
    }
    let recurse = (r, c) => {
      if(visuals[r][c] !== 1) {
        visuals[r][c] = 1;
        if(this.state.board[r][c] > 100) {
          visuals[r][c] = 1
        } else if(this.state.board[r][c] === 100) {
          for(let x = -1; x <= 1; x ++) {
            for(let y = -1; y <= 1; y ++) {
              if((r+x) >= 0 && (r+x) <= 9 && (c+y) >= 0 && (c+y) <= 9) {
                console.log(r+x,c+y)
                recurse(r + x, c + y);
              }
            }
          }
        }
      }
    }
    recurse(rowIndex, colIndex);
    this.setState({
      visuals: visuals,
    }, () => this.handleWin());
  }

  handleWin() {
    let unrevealedCounter = 0;
    let visuals = [...this.state.visuals];
    for(let a = 0; a < visuals.length; a++) {
      for(let b = 0; b < visuals[a].length; b++) {
        if(visuals[a][b] === 100) {
          unrevealedCounter++;
        }
      }
    }
    if(unrevealedCounter === 10) {
      this.setState({
        isWon: true, 
        isRunning: false,
        timer: 0,
        });
    }
  }

  async handleGameStart() {
    this.initializeGame();
    await this.setState({
      isRunning: true,
    });
    this.startTimer();
  }

  revealAllBombs() {
    let visuals = [...this.state.visuals];
    for(let i = 0; i < 10; i++) {
      for(let j = 0; j < 10; j++) {
        if(this.state.board[i][j] === 66) {
          visuals[i][j] = 1;
        }
      }
    }
    this.setState({
      visuals: visuals,
      isGameOver: true,
      isRunning:false,
    });
  }

  render() {
    return (
      <div className="board">
        <div className="cellfield">
          {this.state.board.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
              return (<Cell 
                key={rowIndex-cellIndex} 
                row={rowIndex} 
                cell={cellIndex}
                cellValue={this.state.board}
                visualValue={this.state.visuals}
                handleClick={this.handleClick}
                isGameOver={this.state.isGameOver}
                isWon={this.state.isWon}
                isRunning={this.state.isRunning}
              />)
            })
          })}
        </div> 
        {!this.state.isRunning && 
          <div className="gameOver">
            <button onClick={this.handleGameStart}>Start New Game</button>
          </div>}
        {this.state.isRunning &&
          <div className="gameOver">
            Time: {Math.floor(this.state.timer / 60)}min {this.state.timer % 60}sec
          </div>}
        {this.state.isGameOver && 
          <div className="gameOver">Game Over!
          </div>}
        {this.state.isWon && 
          <div className="gameOver">Game Won!
          </div>}
      </div>
    );
  }
}

export default Board;