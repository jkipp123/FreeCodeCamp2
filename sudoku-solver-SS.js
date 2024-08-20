const completedSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

const symmetricDifference = (setA, setB) => {
  let _difference = new Set(setA);
  for (let elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
};

const isValidValue = (valueSet, value) => {
  const values = new Set(valueSet);
  values.delete(null);
  const validValues = symmetricDifference(values, completedSet);
  return validValues.has(value);
};

class SudokuSolver {
  constructor(puzzleString = null, deterministic = false, verbose = false) {
    this.sudokuBoard = [
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
      [[null, null, null], [null, null, null], [null, null, null]],
    ];

    if (!!puzzleString) {
      this.setBoardFromString(puzzleString);
    }
    this.deterministic = deterministic;
    this.verbose = verbose;
  }

  regionIndex(i) {
    return (Math.floor(i / 27) * 3) + Math.floor((i % 27) / 3) % 3;
  }

  regionRowIndex(i) {
    return Math.floor((i % 27) / 9);
  }

  regionRowCellIndex(i) {
    return (i % 9) % 3;
  }

  boardRowIndex(i) {
    return Math.floor(i / 9);
  }

  boardColumnIndex(i) {
    return i % 9;
  }

  getBoard() {
    return this.sudokuBoard;
  }

  getBoardRegion(row, column) {
    const indexNum = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(indexNum)].flat();
  }

  getBoardRow(row) {
    const result = [];
    const indexNum = row * 9;
    const indexRow = this.regionRowIndex(indexNum);
    const indexSquare = this.regionIndex(indexNum);
    for (let offset = 0; offset < 3; offset++) {
      result.push(this.sudokuBoard[indexSquare + offset][indexRow]);
    }
    return result.flat();
  }

  getBoardColumn(column) {
    const result = [];
    for (let row = 0; row < 9; row++) {
      const index = (row * 9) + column;
      result.push(
        this.sudokuBoard[this.regionIndex(index)]
          [this.regionRowIndex(index)]
          [this.regionRowCellIndex(index)]
      );
    }
    return result;
  }

  getCell(row, column) {
    const index = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowCellIndex(index)];
  }

  setCell(row, column, value) {
    const index = (row * 9) + column;
    if (/[1-9]/.test(value) || value === null) {
      this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowCellIndex(index)] = !!value ? +value : null;
    }
    return this.getCell(row, column);
  }

  removeCell(row, column) {
    const index = (row * 9) + column;
    this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowCellIndex(index)] = null;
  }

  isValidPuzzleString(puzzleString) {
    return this.isValidLength(puzzleString) &&
      this.isValidCharacters(puzzleString);
  }

  isValidLength(puzzleString) {
    return (puzzleString.length === 81);
  }

  isValidCharacters(puzzleString) {
    const puzzleCharacterRegEx = /^[.1-9]+$/;
    return puzzleCharacterRegEx.test(puzzleString);
  }

  isValidRowPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRow(row), value);
    }
  }

  isValidColumnPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardColumn(column), value);
    }
  }

  isValidRegionPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRegion(row, column), value);
    }
  }

  isValidBoard() {
    for (let i = 0; i < 81; i++) {
      const row = this.boardRowIndex(i);
      const column = this.boardColumnIndex(i);
      const cellValue = this.getCell(row, column);
      const validValues = this.getValidPossibleValues(row, column, true);
      if (cellValue && !validValues.has(cellValue)) {
        return false;
      }
    }
    return true;
  }

  isBoardSolved() {
    const diff = symmetricDifference(this.getBoard().flat(2), completedSet);
    return this.isValidBoard() && diff.size === 0;
  }

  getValidPossibleValues(row, column, removeCurrentValue = false) {
    const cellValue = this.getCell(row, column);

    if (removeCurrentValue) {
      this.removeCell(row, column);
    } else if (!!cellValue) {
      return new Set([cellValue]);
    }

    const currentValues = [];
    currentValues.push(this.getBoardRegion(row, column));
    currentValues.push(this.getBoardRow(row));
    currentValues.push(this.getBoardColumn(column));
    const currentSet = new Set(currentValues.flat());
    currentSet.delete(null);
    const possibleValues = symmetricDifference(currentSet, completedSet);
    this.setCell(row, column, cellValue);
    return possibleValues;
  }

  solve() {
    if (!this.isValidBoard()) {
      return 'invalid board';
    }

    const attemptStack = [];
    let attemptCount = 0;

    while (!this.isBoardSolved()) {
      attemptCount++;

      let cells = [];
      let numberOfValidValues = 9;
      let currentValidValues = new Set();
      for (let index = 0; index < 81; index += 1) {
        const row = this.boardRowIndex(index);
        const column = this.boardColumnIndex(index);
        const cellValue = this.getCell(row, column);
        if (!!cellValue) continue;
        currentValidValues = this.getValidPossibleValues(row, column);
        if (currentValidValues.size <= numberOfValidValues) {
          numberOfValidValues = currentValidValues.size;
          cells = cells.filter(e => {
            return e.values.length === numberOfValidValues;
          });
          cells.push({
            row: row,
            column: column,
            values: [...currentValidValues],
          });
        }
      }

      let cell;
      if (this.deterministic) {
        cell = cells.pop();
      } else {
        cell = cells[Math.floor(Math.random() * cells.length)];
      }

      if (cell.values.length === 0 && attemptStack.length > 0) {
        while (attemptStack.length > 0) {
          cell = attemptStack.pop();
          if (cell.values.length > 0) break;
        }
        this.setBoardFromString(cell.string);
      }

      if (cell.values.length === 0 && attemptStack.length === 0) {
        if (this.verbose) console.log(cell);
        return 'Unsolvable puzzle layout';
      }

      let valueIndex;
      if (this.deterministic) {
        cell.setValue = cell.values.pop();
      } else {
        valueIndex = Math.floor(Math.random() * cell.values.length);
        cell.setValue = cell.values[valueIndex];
        cell.values.splice(valueIndex, 1);
      }
      this.setCell(cell.row, cell.column, cell.setValue);
      cell.string = this.getStringFromBoard();
      attemptStack.push(cell);

      if (attemptCount === 5000) {
        if (this.verbose) console.log(attemptStack);
        return 'timeout attempting to solve';
      }
      if (this.verbose) {
        console.log('Count:', attemptCount, 'Stack:', attemptStack.length,
          this + '');
      }
    }
    return this.getStringFromBoard();
  }

  setBoardFromString(puzzleString) {
    if (this.isValidPuzzleString(puzzleString)) {
      puzzleString.split('').forEach((d, i) => {
        this.sudokuBoard[this.regionIndex(i)]
          [this.regionRowIndex(i)]
          [this.regionRowCellIndex(i)] = d !== '.' ? +d : null;
      });
    }
  }

  getStringFromBoard() {
    const result = [];
    for (let index = 0; index < 81; index++) {
      const value = this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowCellIndex(index)];
      result.push(!!value ? value : '.');
    }
    return result.join('');
  }

  toString() {
    return this.getStringFromBoard();
  }
}

module.exports = SudokuSolver;
