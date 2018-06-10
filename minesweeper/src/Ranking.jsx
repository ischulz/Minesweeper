import React from 'react';
import './Ranking.css';
  
const Ranking = ((props) => (
    <div className='rankingTable'>
        <table>
            <thead>
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Time</th>
            </tr>
            </thead>
            <tbody>
            {props.scores.map((item, i) => {
                return (<tr key={i}>
                    <td>{i + 1}.</td>
                    <td>{item[0]}</td>
                    <td>{Math.floor(item[1] / 60)}min {item[1] % 60}sec</td>
                </tr>)
            })}
            </tbody>
        </table>
    </div>
));

export default Ranking;