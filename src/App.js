import { useEffect, useState } from 'react';
import { Graph } from "react-d3-graph";
import TextField from '@material-ui/core/TextField';

import TSP from './algorithm';

import './App.css';
import { Button } from '@material-ui/core';
 
const myConfig = {
    nodeHighlightBehavior: true,
    node: {
        color: "green",
        size: 300,
        highlightStrokeColor: "red",
    },
    link: {
        highlightColor: "lightblue",
    },
};


const initialMatrix = [
  [0, 2, 7, 0, 0, 0, 0],
  [2, 0, 0, 3, 3, 4, 0],
  [7, 0, 0, 1, 0, 0, 0],
  [0, 3, 7, 0, 5, 1, 0],
  [0, 3, 0, 5, 0, 0, 5],
  [0, 4, 0, 1, 0, 0, 2],
  [0, 0, 0, 0, 5, 2, 0]
];

function App() { 
  const [matrix, setMatrix] = useState(initialMatrix);
  const [initialSchema, setInitialSchema] = useState(null); 
  const [schema, setSchema] = useState(null);
  const [minPath, setMinPath] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const newMatrix = [];
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] > 0) {
          newMatrix.push(matrix[i]);
          break;
        }
      }
    }

    newMatrix.forEach(arr => {
      arr = [...arr];
      arr.length = newMatrix.length;
    });

    const tsp = new TSP(newMatrix);
    setSchema(tsp.solve());
    setMinPath(tsp.path);

    const newInitSchema = {
      nodes: [],
      links: []
    };

    const nodeIndexes = [];

    for (let j = 0; j < matrix.length; j++) {
      for (let i = 0; i < matrix.length; i++) {
        if (matrix[i][j] > 0) {
          nodeIndexes.push(j);
          break;
        }
      }
    }    

    nodeIndexes.forEach((el) => {
      newInitSchema.nodes.push({ id: TSP.toString(el) });
    });

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (nodeIndexes.includes(i) && nodeIndexes.includes(j) && matrix[i][j] > 0) {
          newInitSchema.links.push({ source: TSP.toString(i), target: TSP.toString(j) });
        }
      }
    }

    setInitialSchema(newInitSchema);
    setLoader(false);
  }, [matrix]);

  const sumMatrix = (matrix) => matrix.reduce((acc, curr) => acc + curr.reduce((a, c) => a + c, 0), 0);

  const handleChange = (e, i, j) => {
    const { value } = e.target;
    const m = [...matrix];
    m[i][j] = Number(value) || 0;
    m[j][i] = Number(value) || 0;

    setLoader(true);

    if (sumMatrix(m) > 0)
      setMatrix(m);
  };

  const increaseMatrix = () => {
    const newMatrix = [...matrix];
    const len = newMatrix.length;
    const newArr = [];

    newMatrix.forEach(arr => arr.push(0));
    for (let i = 0; i <= len; i++) {
      newArr.push(0);
    }
    newMatrix.push(newArr);

    setMatrix(newMatrix);
  };

  const decreaseMatrix = () => {
    const newMatrix = [...matrix];
    newMatrix.pop();
    newMatrix.forEach(arr => arr.pop());
    setMatrix(newMatrix);
  };

  return (
    <div className="App">
      <div className="form-container">
        <h2>Матриця</h2>
        <Button color="primary" onClick={increaseMatrix}>+</Button>
        {
          matrix.map((r, i) => (
            <div key={i}>
              {r.map((el, index) =>
                <TextField
                  key={index}
                  value={el}
                  disabled={i === index}
                  onChange={(e) => handleChange(e, i, index)}
                  />
              )}
            </div>
          ))
        }
        <Button disabled={matrix.length < 3} color="secondary" onClick={decreaseMatrix}>-</Button>
      </div>
      { sumMatrix(matrix) > 0 && !loader &&
        <div className="container">
          <section>
            <h2>Початковий граф</h2>
            {initialSchema && (
              <Graph
                id="graph-id-0"
                data={initialSchema}
                config={myConfig}
              />
            )}
          </section>
          <section>
            {minPath && <h2>Мінімальний шлях = {minPath}</h2>}
            {schema && (
              <Graph
                id="graph-id-1"
                data={schema}
                config={myConfig}
              />
            )}
          </section>
        </div>
      }
    </div>
  );
}

export default App;
