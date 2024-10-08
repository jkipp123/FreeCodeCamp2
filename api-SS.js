'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  const solver = new SudokuSolver();

  const convertCoordinate = (coordinate) => {
    const result = coordinate.split('');
    result[0] = result[0].codePointAt(0) - 'A'.codePointAt(0);
    result[1] = +result[1] - 1;
    return result;
  };

  const getPuzzleStringError = (puzzleString) => {
    if (!solver.isValidPuzzleString(puzzleString)) {
      if (!solver.isValidLength(puzzleString)) {
        return {error: 'Expected puzzle to be 81 characters long'};
      } else if (!solver.isValidCharacters(puzzleString)) {
        return {error: 'Invalid characters in puzzle'};
      } else {
        return {error: 'Unknown error, this is a bug'};
      }
    } else {
      return {error: 'Valid puzzle passed to getPuzzleStringError function, this is a bug'};
    }
  };

  app.route('/api/check')
  .post((req, res) => {
    const { puzzle = null, coordinate = null, value = null } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: 'Required field(s) missing' });
    } else if (!/^[A-I][1-9]$/.test(coordinate)) {
      res.json({ error: 'Invalid coordinate' });
    } else if (!/^[1-9]$/.test(value)) {
      res.json({ error: 'Invalid value' });
    } else if (!solver.isValidPuzzleString(puzzle)) {
      res.json(getPuzzleStringError(puzzle));
    } else {
      solver.setBoardFromString(puzzle);
      const [row, column] = convertCoordinate(coordinate);
      const cellValue = solver.getCell(row, column);
      const conflicts = [];

      if (cellValue === +value) {
        res.json({ valid: true });
        return;
      }

      if (!solver.isValidRowPlacement(row, column, +value)) {
        conflicts.push('row');
      }
      if (!solver.isValidColumnPlacement(row, column, +value)) {
        conflicts.push('column');
      }
      if (!solver.isValidRegionPlacement(row, column, +value)) {
        conflicts.push('region');
      }

      if (!conflicts.length) {
        res.json({ valid: true });
      } else {
        res.json({ valid: false, conflict: conflicts });
      }
    }
  });

  app.route('/api/solve')
    .post((req, res) => {
      if (!!req.body.puzzle) {
        const puzzle = req.body.puzzle;
        if (solver.isValidPuzzleString(puzzle)) {
          solver.setBoardFromString(puzzle);
          const solution = solver.solve();
          const solutionErrorRegEx = /timeout|invalid|Unsolvable/;
          res.json(solutionErrorRegEx.test(solution)
            ? {error: 'Puzzle cannot be solved'}
            : {solution: solution});
        } else {
          res.json(getPuzzleStringError(puzzle));
        }
      } else {
        res.json({error: 'Required field missing'});
      }
    });
};
