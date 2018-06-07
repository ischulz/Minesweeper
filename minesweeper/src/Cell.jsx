import React from 'react';
import './Cell.css';

const Cell = ((props) => (
    <div 
      className={props.visualValue[props.row][props.cell] === 1 ? 'cell cellClicked' : 'cell cellUnclicked'}
      onClick={() => props.handleClick(props.row, props.cell)}
    >
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 66 && 'Bomb!'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 101 && '1'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 102 && '2'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 103 && '3'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 104 && '4'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 105 && '5'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 106 && '6'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 107 && '7'}
      {props.visualValue[props.row][props.cell] === 1 && props.cellValue[props.row][props.cell] === 108 && '8'}

    </div>
));

export default Cell;