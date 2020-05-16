import React from 'react';

const emptyfunction = () => { }

function money_format(value) { return "$" + value.toFixed(2); }
const MoneyVisualizer = ({ amount, hoursPerDay }) => {
  return <span> {money_format(amount)} Per Hour ({money_format(amount * hoursPerDay)} Per Day) </span>;
}

const Table = ({ headers, body }) => {
  return (
    <table>
      <thead>{headers}</thead>
      <tbody>{body}</tbody>
    </table>
  );
}

const THeader = ({ children }) => {
  return <th>{children}</th>;
}

const TRow = ({ children }) => {
  return (<tr>{children}</tr>);
}

const TColumn = ({ children }) => {
  return <td>{children}</td>;
}

export {
  emptyfunction,
  money_format,
  MoneyVisualizer,
  Table,
  THeader,
  TRow,
  TColumn,
}
