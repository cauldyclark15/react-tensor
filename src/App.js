import React, { useState } from "react";
import * as R from "rambda";

import "./App.css";

function App() {
  const [randomPoints, setRandomPoints] = useState(getRandomPoints(0, 7000));
  const [currentPoint, setCurrentPoint] = useState("");
  const [randomWeights, setRandomWeights] = useState(getRandomWeights());

  return (
    <div className="App">
      <button
        onClick={() => {
          setRandomWeights(getTrainedWeights(randomWeights, 10));
        }}
      >
        10 samples
      </button>
      <button
        onClick={() => {
          setRandomWeights(getTrainedWeights(randomWeights, 1000));
        }}
      >
        1000 samples
      </button>
      <button
        onClick={() => {
          setRandomWeights(getTrainedWeights(randomWeights, 5000000));
        }}
      >
        5M samples
      </button>
      <h2>Train by samples, lower part - red, upper is blue</h2>
      <svg width="800" height="800">
        {randomPoints.map((item, index) => (
          <circle
            key={index}
            fill={guess(randomWeights, item) === -1 ? "red" : "blue"}
            cx={item.x}
            cy={item.y}
            r="3"
          />
        ))}
        <line
          x1="0"
          x2="800"
          y1="0"
          y2="800"
          stroke="mediumaquamarine"
          strokeWidth="5"
        />
      </svg>
    </div>
  );
}

function rand(high, low) {
  return Math.random() * (high - low) + low;
}

function getTeam(point) {
  return point.x > point.y ? 1 : -1;
}

function getRandomPoints(lowRange, highRange) {
  return R.range(lowRange, highRange).map(_ => ({
    x: rand(0, 800),
    y: rand(0, 800)
  }));
}

function train(weights, point, team) {
  const guessResult = guess(weights, point);
  const error = team - guessResult;
  const learningRate = 0.001;
  const result = {
    x: weights.x + point.x * error * learningRate,
    y: weights.y + point.y * error * learningRate
  };

  return result;
}

function getTrainedWeights(currentRandomWeights, numOfSamples) {
  const examples = getRandomPoints(0, numOfSamples).map(point => ({
    point,
    team: getTeam(point)
  }));

  let currentWeights = currentRandomWeights;
  for (const example of examples) {
    currentWeights = train(currentWeights, example.point, example.team);
  }
  return currentWeights;
}

function getRandomWeights() {
  return {
    x: rand(-1, 1),
    y: rand(-1, 1)
  };
}

function guess(weights, point) {
  const sum = point.x * weights.x + point.y * weights.y;
  const team = sum >= 0 ? 1 : -1;
  return team;
}

export default App;
