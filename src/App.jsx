import React, { useContext, useState } from 'react';
import './App.sass';
import useInterval from './useInterval';
import { JOBS } from './data';
import { ActivityData, DataProviders, TimeData, Resources, UserInfo, } from './context';
import { MoneyVisualizer, Table, TRow, TColumn, } from './utils';

const DateTime = () => {
  const { epoch, setEpoch, date } = useContext(TimeData);
  useInterval(() => { setEpoch(epoch + 60000) }, 1000)
  return <span>{date.toDateString()} {date.toLocaleTimeString()}</span>
}

const Dashboard = () => {
  const items = useContext(Resources);
  return (
    <Table
      headers={<tr><th><span>Resources</span></th></tr>}
      body={
        Object.keys(items).map((name) => {
          const item = items[name]
          return item.show ? <TRow key={name}><TColumn>{name} : {item.format(item.value)} </TColumn></TRow> : null;
        })
      }
    />
  );
}

const UserDisplay = () => {
  const { name } = useContext(UserInfo);
  return (
    <div>
      {name}
    </div>
  );

}


const ExpenseContent = () => {
  const { isWorkHours, workingHours } = useContext(TimeData);
  const { money } = useContext(Resources);
  const { job, expenses } = useContext(UserInfo);
  useInterval(() => {
    money.set(
      money.value
      - (expenses.amt / 60)
      + (isWorkHours ? (job.wage / 60) : 0)
    );
  }, 1000);
  const netIncome = (job.wage * workingHours - expenses.amt * 24) / 24;

  const IncomeMessage = ({
    colorClass, header, left, right,
  }) => {
    return (
      <div className={`message ${colorClass}`} >
        <div className="message-header">
          {header}
        </div>
        <div className="message-body">
          <div className="columns">
            <div className="column">
              {left}
            </div>
            <div className="column">
              {right}
            </div>
          </div>
        </div>
      </div >
    );
  }

  return (
    <>
      <IncomeMessage
        key="net"
        colorClass="is-dark"
        header={
          "Net Income /Hour (/Day)"
        }
        left={
          <>
            Net Income <br />
          </>
        }
        right={
          <>
            <MoneyVisualizer
              amount={netIncome}
              enableColor={true}
              hoursPerDay={24}
            /> <br />
          </>
        }
      />
      <IncomeMessage
        colorClass="is-success"
        header={
          "Income"
        }
        left={
          <>
            {job.title}<br />
            <hr />
              Total Income<br />
          </>
        }
        right={
          <>
            <MoneyVisualizer amount={job.wage} hoursPerDay={workingHours} /><br />
            <hr />
            <MoneyVisualizer amount={job.wage} hoursPerDay={workingHours} /><br />
          </>
        }
      />
      <IncomeMessage
        colorClass="is-danger"
        header={
          "Expenses"
        }
        left={
          <>
            {expenses.values.map(expense => <>{expense.description}<br /> </>)}
            <hr />
              Total Expenses <br />
          </>
        }
        right={
          <>
            {expenses.values.map((expense, i) => (
              <><MoneyVisualizer amount={expense.charge} hoursPerDay={24} /><br /></>
            ))
            }
            <hr />
            <MoneyVisualizer amount={expenses.amt} hoursPerDay={24} color="expense" /><br />
          </>
        }
      />
    </>
  );
}

const Content = () => {
  const [activeTab, setActiveTab] = useState(1);
  const tabs = [
    ["Income", <ExpenseContent />],
    ["Job", <JobDisplay />],
  ]
  return (<>
    <div className="tabs">
      <ul>
        {tabs.map((t, i) => {
          return (
            <li key={i} className={activeTab === i ? "is-active" : ""}>
              <a href="#" onClick={() => { setActiveTab(i) }}> {t[0]} </a>
            </li>
          );
        })}
      </ul>
    </div>
    {tabs[activeTab][1]}
  </>);
}

const JobDisplay = () => {
  const { setJob } = useContext(UserInfo)
  const { activites } = useContext(ActivityData);
  const { employees } = useContext(Resources)

  // TODO probably shouldnt have to remember which activy is which
  const work = activites[1];
  const jobs = Object.keys(JOBS).map(j => JOBS[j]);
  return (
    <>
      <div className="columns">
        <div className="column">
          {"Titles"}
          <ul> {jobs.map((t) => <li key={"title" + t.title}>{t.title}</li>)} </ul>
        </div>
        {/* TODO add levels and exp */}
        <div className="column">
          {"Income"}
          <ul>
            {jobs.map((t, i) => {
              return (
                <li key={"wage" + i}>
                  <MoneyVisualizer amount={t.wage} hoursPerDay={work[1] + (work[2] / 60)} />
                </li>
              );
            }
            )}
          </ul>
        </div>
        <div className="column">
          {"Income / Employee "}
          <ul>
            {jobs.map((t, i) => {
              return <li key={"wage_emp" + i}>
                <MoneyVisualizer amount={t.wage_per_emp} hoursPerDay={employees.value} />
              </li>;
            }
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <div className="container is-fluid">
      <DataProviders>
        <h1 className="title">df</h1>
        <div className="columns">
          <div className="column is-one-quarter">
            <DateTime />
            <UserDisplay />
            <Dashboard />
          </div>
          <div className="column">
            <Content />
          </div>
        </div>
      </DataProviders>
    </div>
  );
}

export default App;
