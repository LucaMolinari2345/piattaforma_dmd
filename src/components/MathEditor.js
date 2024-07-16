import React, { useState } from 'react';
import MathQuill, { addStyles as addMathquillStyles } from 'react-mathquill';
import MathKeyboard from './MathKeyboard';


// Aggiungi gli stili di MathQuill
addMathquillStyles();

const MathEditor = () => {
  const [latex, setLatex] = useState('');
  let mathFieldRef = null;

  const handleInsert = (symbol) => {
    if (mathFieldRef) {
      if (symbol === '=') {
        // Logica per valutare l'espressione può essere aggiunta qui
        return;
      }
      mathFieldRef.write(symbol);
      setLatex(mathFieldRef.latex());
    }
  };

  return (
    <div className="math-editor">
      <h2>Math Editor</h2>
      <MathQuill
        latex={latex}
        onChange={(mathField) => {
          setLatex(mathField.latex());
          mathFieldRef = mathField;
        }}
      />
      <MathKeyboard onInsert={handleInsert} />
      <textarea
        value={latex}
        onChange={(e) => setLatex(e.target.value)}
        className="math-editor-textarea h-44 w-44"
      />
    </div>
  );
};

export default MathEditor;
