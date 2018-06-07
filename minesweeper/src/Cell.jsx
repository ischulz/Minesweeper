import React from 'react';
import './Cell.css';

const getCellText = (text, value, props) =>
    props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === value && <div className="cellText">{text}</div>;
  

const Cell = ((props) => (
    <div 
      className={props.visualValue[props.row][props.cell] === 1 ? 'cell cellClicked' : 'cell cellUnclicked'}
      onClick={() => props.handleClick(props.row, props.cell)}
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