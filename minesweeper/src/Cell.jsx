import React from 'react';
import './Cell.css';

import FontAwesome from 'react-fontawesome';

const getCellText = (text, value, props) => {
    if(text === 'Bomb') {
      return props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === value && 
      <div className="cellText">
        <FontAwesome
          className='super-crazy-colors'
          name='bomb'
          size='2x'
          spin
          style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
        />
      </div>
    }
    return props.visualValue[props.row][props.cell] === 1 && 
            props.cellValue[props.row][props.cell] === value && 
            <div className="cellText">{text}</div>;
};
  
const Cell = ((props) => (
    <div 
      className={`${props.visualValue[props.row][props.cell] === 1 ? 'cell cellClicked' : 'cell cellUnclicked'} ${(props.isGameOver || props.isWon) ? 'disableCell':''}`}
      onClick={() => {
        if(!props.isGameOver) {
          props.handleClick(props.row, props.cell)}
        }
      }
    >
      {getCellText('Bomb', 66, props) ||
      getCellText(1, 101, props) ||
      getCellText(2, 102, props) ||
      getCellText(3, 103, props) ||
      getCellText(4, 104, props) ||
      getCellText(5, 105, props) ||
      getCellText(6, 106, props) ||
      getCellText(7, 107, props) ||
      getCellText(8, 108, props)}
    </div>
));

export default Cell;