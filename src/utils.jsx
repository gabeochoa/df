import React from 'react';

const emptyfunction = () => { }

function money_format(amt) {
  let options = {
    style: 'currency',
    currency: 'USD',
    notation: "compact",
  }
  return amt.toLocaleString('en-US', options);
}

const MoneyVisualizer = ({ amount, hoursPerDay, enableColor }) => {
  return (
    <>
      {enableColor &&
        <span className={amount < 0 ? "message is-danger" : "message is-success"}>
          {money_format(amount)}/Hour ({money_format(amount * hoursPerDay)})
        </span>
      }
      {!enableColor &&
        <span>
          {money_format(amount)}/Hour ({money_format(amount * hoursPerDay)})
        </span>
      }
    </>
  );
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
