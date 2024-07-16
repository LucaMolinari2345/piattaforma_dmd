import React from 'react';


const MathKeyboard = ({ onInsert }) => {
  const rows = [
    ['7', '8', '9', '\\div'],
    ['4', '5', '6', '\\times'],
    ['1', '2', '3', '-'],
    ['0', '.', '=', '+'],
    ['\\sqrt', '\\frac', '\\pi', '(', ')'],
    ['\\sin', '\\cos', '\\tan', '^', '_'],
  ];

  return (
    <div className="math-keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="math-keyboard-row">
          {row.map((symbol) => (
            <button
              key={symbol}
              className="math-keyboard-button"
              onClick={() => onInsert(symbol)}
            >
              {symbol}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MathKeyboard;
