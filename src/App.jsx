import React, { useContext, useState } from 'react';
import useInterval from './useInterval';
import { JOBS } from './data';
import { DataProviders, TimeData, Resources, UserInfo, Flags } from './context';
import { MoneyVisualizer, Table, TRow, TColumn, THeader } from './utils';

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
    <div style={{ pading: 12, }}>
      <Table
        headers={<TRow><THeader>{name}</THeader></TRow>}
        body={<Job />}
      />
    </div>
  );

}

const Job = () => {
  const { isWorkHours, workingHours, workStart, workEnd } = useContext(TimeData);
  const { money } = useContext(Resources);
  const { job, expenses } = useContext(UserInfo);
  useInterval(() => {
    money.set(
      money.value
      - (expenses.amt / 60)
      + (isWorkHours ? (job.wage / 60) : 0)
    );
  }, 1000);
  // TODO fix local based rendering of workHours
  // should be until 1800 for 24h and Until 6PM for 12h
  const location = isWorkHours ? "At Work Until " + (workEnd - 12) + "PM" : "At Home Until" + workStart + "AM";

  const expense_table = (
    <Table
      headers={
        <TRow>
          <THeader>Expenses:</THeader>
          <THeader>
            <MoneyVisualizer amount={expenses.amt} hoursPerDay={24} />
          </THeader>
        </TRow>
      }
      body={
        expenses.values.map((expense, i) => {
          return (
            <TRow key={i}>
              <TColumn>{expense.description}</TColumn>
              <TColumn> <MoneyVisualizer amount={expense.charge} hoursPerDay={24} /> </TColumn>
            </TRow>
          );
        })
      }
    />
  );

  return <>
    <TRow>
      <TColumn>Net Income:</TColumn>
      <TColumn> <MoneyVisualizer amount={(job.wage * workingHours - expenses.amt * 24) / 24} hoursPerDay={24} /> </TColumn>
    </TRow>
    <TRow><TColumn>{location}</TColumn></TRow>
    <TRow>
      <TColumn>Current Job:</TColumn>
      <TColumn>{job.title}</TColumn>
    </TRow>
    <TRow>
      <TColumn>Wage:</TColumn>
      <TColumn>
        <MoneyVisualizer amount={job.wage} hoursPerDay={workingHours} />
      </TColumn>
    </TRow>
    <TRow><TColumn>{expense_table} </TColumn></TRow>
  </>;
}

const Content = () => {
  const { setJob } = useContext(UserInfo);
  return (<>
    <button onClick={() => { setJob(JOBS.HANDYMAN) }}> get job</button>
    <button onClick={() => { setJob(JOBS.UNEMPLOYED) }}> quit job</button>
  </>);
}



const JobDisplay = () => {
  const { workingHours, expenses } = useContext(UserInfo);
  return (
    <Table
      headers={
        <TRow><THeader>Jobs</THeader></TRow>
      }
      body={
        Object.keys(JOBS).map((j) => {
          const job = JOBS[j];
          return (
            <TRow key={j}>
              <TColumn>{job.title}</TColumn>
              <TColumn>{job.description}</TColumn>
              <TColumn> <MoneyVisualizer amount={(job.wage * workingHours - expenses.amt * 24) / 24} hoursPerDay={24} /> </TColumn>
            </TRow>
          );
        })
      }
    />
  );
}

function App() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: 'auto'
    }}>
      <DataProviders>
        <JobDisplay />
        <DateTime />
        <UserDisplay />
        <Dashboard />
        <Content />
      </DataProviders>
    </div>
  );
}

export default App;
