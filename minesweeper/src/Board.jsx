import React, { Component } from 'react';
import Cell from './Cell.jsx';
import Ranking from './Ranking.jsx';
import './Board.css';

import axios from 'axios';



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
      beatTime: 0,
      scores: [],
      flags: [],
    }
    this.handleClick      = this.handleClick.bind(this);
    this.revealAllBombs   = this.revealAllBombs.bind(this);
    this.handleWin        = this.handleWin.bind(this);
    this.handleGameStart  = this.handleGameStart.bind(this);
    this.startTimer       = this.startTimer.bind(this);
    this.fetchScoreData   = this.fetchScoreData.bind(this);
    this.sortScores       = this.sortScores.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
    this.toggleFlag       = this.toggleFlag.bind(this);
  }

  componentWillMount() {
    this.initializeGame();
  }

  fetchScoreData() {
    let that = this;
    axios.get(`/getScore`)
    .then(function (response) {
      console.log('RESPONSE', response)
      let currentScores = [];
      let newEntry = [];
      for(let i = 0; i < response.data.length; i++){
        newEntry = [];
        newEntry.push(response.data[i].name);
        newEntry.push(response.data[i].score);
        currentScores.push(newEntry);
      }
      that.setState({scores: currentScores}, that.sortScores);
    })
    .catch(function (error) {
      console.log('ERROR', error);
    });
  }

  postScoreData(name, score) {
    let that = this;
    axios.post(`/storeScore`, {
      name: name,
      score: score,
    })
    .then(function (response) {
      that.fetchScoreData();
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  sortScores() {
    let scores = this.state.scores;
    scores = scores.sort(function(a, b) {
      if (a[1] > b[1]) {
        return 1;
      }
      if (a[1] < b[1]) {
        return -1;
      }
      return 0;
    });
    this.setState({ scores })
  }

  initializeGame = () => {
    this.fetchScoreData();
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
    console.log(mineCounter);
    for(let a = 0; a < 10; a ++) {
      for(let b = 0; b < 10; b ++) {
        if(board[a][b] === 66) {
          if(board[a+1]     && board[a+1][b-1]      && board[a+1][b-1] !== 66)  {board[a+1][b-1]+=1};
          if(board[a][b+1]  && board[a][b+1] !== 66)                            {board[a][b+1]+=1};
          if(board[a+1]     && board[a+1][b]        && board[a+1][b] !== 66)    {board[a+1][b]+=1};
          if(board[a+1]     && board[a+1][b+1]      && board[a+1][b+1] !== 66)  {board[a+1][b+1]+=1};
          if(board[a-1]     && board[a-1][b-1]      && board[a-1][b-1] !== 66)  {board[a-1][b-1]+=1};
          if(board[a-1]     && board[a-1][b]        && board[a-1][b] !== 66)    {board[a-1][b]+=1};
          if(board[a][b-1]  && board[a][b-1] !== 66)                            {board[a][b-1]+=1};
          if(board[a-1]     && board[a-1][b+1]      && board[a-1][b+1] !== 66)  {board[a-1][b+1]+=1};
        }
      } 
    }
    this.setState({
      board: board,
      visuals: visuals,
      isGameOver: false,
      isWon: false,
      timer: 0,
      beatTime: 0,
      flags: [],
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

  async handleRightClick(rowIndex, colIndex) {
    let currentFlags = [...this.state.flags];
    let flagIndex = -1;
    let position = [rowIndex, colIndex];
    if(!this.state.isRunning){
      return;
    }
    if(currentFlags.length !== 0) {
      for(let i = 0; i < currentFlags.length; i++) {
        if(JSON.stringify(position) === JSON.stringify(currentFlags[i])) {
          flagIndex = i;
        }
      }
    }

    if(flagIndex === -1) {
      currentFlags.push([rowIndex, colIndex]);
    }else {
      currentFlags.splice(flagIndex, 1);
    }
    await this.setState({
      flags: currentFlags,
    });
    this.handleWin();
  }

  handleClick(rowIndex, colIndex) {
    if(!this.state.isRunning){
      return;
    }
    let visuals = [...this.state.visuals];
    if (this.state.board[rowIndex][colIndex] === 66 && !this.state.isGameOver) {
        this.revealAllBombs();
        return;
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

  toggleFlag(arr) {
    let cellIsFlagged = false;
    let currentFlags = [...this.state.flags];
    for(let i = 0; i < currentFlags.length; i++) {
      if(JSON.stringify(arr) === JSON.stringify(currentFlags[i])) {
        cellIsFlagged = true;
      }
    }
    return cellIsFlagged;
  }

  async handleWin() {
    let unrevealedCounter = 0;
    let flagsCorrect = 0;
    let visuals = [...this.state.visuals];
    let flags = this.state.flags;
    if(flags.length === 10) {
      for(let i = 0; i < flags.length; i++) {
        if(this.state.board[flags[i][0]][flags[i][1]] === 66) {
          flagsCorrect++;
        }
      }
    }
    if(flagsCorrect !== 10) {
      for(let a = 0; a < visuals.length; a++) {
        for(let b = 0; b < visuals[a].length; b++) {
          if(visuals[a][b] === 100) {
            unrevealedCounter++;
          }
        }
      }
    }
    if(unrevealedCounter === 10 || flagsCorrect === 10) {
      let winTime = this.state.timer;
      await this.setState({
        isWon: true, 
        isRunning: false,
        timer: 0,
        beatTime: winTime,
      });
      let name = prompt('Enter Name:');
      let score = this.state.beatTime;
      this.postScoreData(name, score);
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
        <h1>Minesweeper</h1>
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
                handleRightClick={this.handleRightClick}
                toggleFlag ={this.toggleFlag}
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
          <div className="gameOver">You won in {Math.floor(this.state.beatTime / 60)}min {this.state.beatTime % 60}sec!
          </div>}
        <Ranking scores={this.state.scores}/>
      </div>
    );
  }
}

export default Board;