const { readFileSync } = require('fs');

function memory() {
  const memory_used = process.memoryUsage();
  for (let key in memory_used) {
    console.log(
      `${key} ${Math.round((memory_used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
}

console.time('parse');
const { selections, boards } = (() => {
  const input = readFileSync('input', { encoding: 'utf-8' });
  // let input = `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

  // 22 13 17 11  0
  //  8  2 23  4 24
  // 21  9 14 16  7
  //  6 10  3 18  5
  //  1 12 20 15 19

  //  3 15  0  2 22
  //  9 18 13 17  5
  // 19  8  7 25 23
  // 20 11 10 24  4
  // 14 21 16 12  6

  // 14 21 17 24  4
  // 10 16 15  9 19
  // 18  8 23 26 20
  // 22 11 13  6  5
  //  2  0 12  3  7`;

  let [selections, ...boards] = input.split('\n\n');
  selections = selections.split(',');
  boards = boards.map((board) =>
    board.split('\n').map((row) =>
      row
        .trim()
        .replace(/[ ]+/g, ',')
        .split(',')
        .map((value) => ({
          value,
          mark: false,
        }))
    )
  );

  return {
    selections,
    boards,
  };
})();
console.timeEnd('parse');

const board_size = boards[0].length;
const board_win = (1 << board_size) - 1;

const board_maps = boards.map((board) => {
  return board.reduce((o, row, row_i) => {
    for (let col_i = 0; col_i < row.length; col_i++) {
      o[row[col_i].value] = [row_i, col_i];
    }

    return o;
  }, {});
});

const board_marks = boards.map((_) => ({
  rows: new Array(board_size).fill(0),
  cols: new Array(board_size).fill(0),
}));

console.time('find winner');
let winners_map = new Map();

for (const selection of selections) {
  console.time('eval boards');
  for (let board_i = 0; board_i < boards.length; board_i++) {
    if (winners_map.has(board_i)) continue;

    const map = board_maps[board_i];

    const pos = map[selection];
    if (!pos) continue;

    const [row, col] = pos;

    const board = boards[board_i];
    const marks = board_marks[board_i];

    board[row][col].mark = true;

    marks.rows[row] |= 1 << (board_size - col - 1);
    marks.cols[col] |= 1 << (board_size - row - 1);

    if (
      marks.rows.some((mark) => mark === board_win) ||
      marks.cols.some((mark) => mark === board_win)
    ) {
      console.log('board win:', board_i);

      winners_map.set(board_i, [board, selection]);
    }
  }
  console.timeEnd('eval boards');

  if (winners_map.size === boards.length) break;
}
console.timeEnd('find winner');

function get_winner_sum(board, selection) {
  const win_sum = board.reduce((o, row) => {
    return (
      o +
      row.reduce((o, { value, mark }) => {
        if (mark) return o;
        return o + parseInt(value);
      }, 0)
    );
  }, 0);

  console.log('sum:', win_sum);
  console.log('selection:', parseInt(selection));
  console.log('answer', win_sum * parseInt(selection));
  console.log();
}

const winners = [...winners_map.values()];

const [first_winner, first_selection] = winners[0];
const [last_winner, last_selection] = winners[winners.length - 1];

console.log();
console.log('first winner');
get_winner_sum(first_winner, first_selection);

console.log('last winner');
get_winner_sum(last_winner, last_selection);
