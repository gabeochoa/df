import React, { useContext, useState } from 'react';
import useInterval from './useInterval';

const emptyfunction = () => {}

const JOBS = {
  UNEMPLOYED: {
    wage: 0,
    title: "Unemployed",
  },
  HANDYMAN: {
    wage: 10,
    title: "Handyman",
  },
  CORNER_DEALER: {
    wage: 20,
    title: "Corner Dealer",
  },
}

const Flags = React.createContext({});
const UserInfo = React.createContext({ });
const Resources = React.createContext({ });
const TimeData = React.createContext({});

const Table = ({headers, body}) => <table><thead>{headers}</thead><tbody>{body}</tbody></table>;
const TableRow = ({children}) => <tr><td>{children}</td></tr>;

const TimeProvider = ({children}) => {
  const [epoch, setEpoch] = useState(160578000000);
  const date = new Date(epoch);
  const hour = date.getHours()
  const workStart = 8;
  const workEnd = 18;
  const td_values = {
    epoch, setEpoch,
    date, 
    workStart, workEnd,
    isWorkHours: hour >= workStart && hour <= workEnd,
    workingHours: 24 - (18 - 8)
  }
  return <TimeData.Provider value={td_values}> {children} </TimeData.Provider>
}

const FlagProvider = ({children}) => {
  const flag_info = {
    has_money: true,
    can_employ: false,
  }
  return <Flags.Provider value={flag_info}> {children} </Flags.Provider>;
}

function money_format(value){ return "$"+value.toFixed(2); }

const MoneyVisualizer = ({amount, hoursPerDay}) => {
  return <span> {money_format(amount)} Per Hour ({money_format(amount * hoursPerDay)} Per Day) </span>;
}

const ResourcesProvider = ({children}) => {
  const [money, setMoney] = useState(0);
  const provider_values = {
    "money": { "value": money, "format": money_format, set: setMoney, show: true},
    "employees": { "value": money, "format_prefix": "$", set: emptyfunction, show: false}
  }
  return <Resources.Provider value={provider_values}>{children}</Resources.Provider>
}

const UserInfoProvider = ({children}) => {
  const [job, setJob] = useState(JOBS.HANDYMAN);
  const [exps, setExpenses] = useState([
    { name: "rent", charge: 0, description: "Living at Home" },
    { name: "food", charge: 0.5, description: "Food" },
  ]);
  const user_info = {
    job, setJob,
    name: "Pablo Escobar",
    expenses: {
      values: exps,
      amt: exps.map(e => e.charge).reduce( (total, c) => total + c, 0)
    }, setExpenses,
  }
  return <UserInfo.Provider value={user_info}>{children}</UserInfo.Provider>;
}

const DataProviders = ({children}) => {
  return (
  <FlagProvider>
      <UserInfoProvider>
        <ResourcesProvider>
          <TimeProvider>
            {children}
          </TimeProvider>
        </ResourcesProvider>
      </UserInfoProvider>
    </FlagProvider>
  );
}
const DateTime = () => {
  const {epoch, setEpoch, date} = useContext(TimeData);
  useInterval( () => { setEpoch(epoch + 60000) }, 1000)
  return <span>{date.toDateString()} {date.toLocaleTimeString()}</span>
}

const Dashboard = () => {
  const items = useContext(Resources);
  return (
    <Table
      headers={<tr><th><span>Resources</span></th></tr>}
      body={
      Object.keys(items).map( (name) => {
        const item = items[name]
        return item.show? <TableRow key={name}><span>{name} : {item.format(item.value)} </span></TableRow>: null;
      })
      }
    />
  );
}

const UserDisplay = () => {
  const { name }= useContext(UserInfo);
  return (
    <div style={{ pading: 12, }}>
      <Table
        headers={ <tr><th><span>{name}</span></th></tr> }
        body={<><Job/></>}
      />
    </div>
  );

}

const Content = () => {
  const {setJob} = useContext(UserInfo);
  return (<>
   <button onClick={() => { setJob(JOBS.HANDYMAN) }}> get job</button>
   <button onClick={() => { setJob(JOBS.UNEMPLOYED) }}> quit job</button>
   </>);
}


const Job = () => {
  const {isWorkHours, workingHours, workStart, workEnd} = useContext(TimeData);
  const {money} = useContext(Resources);
  const {job, expenses} = useContext(UserInfo);
  useInterval( () => { 
    money.set(
        money.value 
        - (expenses.amt / 60)
        + (isWorkHours ? (job.wage/60) : 0)
    );
  }, 1000);
  // TODO fix local based rendering of workHours
  // should be until 1800 for 24h and Until 6PM for 12h
  const location = isWorkHours? "At Work Until " +  (workEnd-12) + "PM" : "At Home Until" + workStart + "AM";
  return <>
    <TableRow> <span>{location}</span> </TableRow>
    <TableRow> <span>Current Job: {job.title}</span> </TableRow>
    <TableRow> <span> Wage: <MoneyVisualizer amount={job.wage} hoursPerDay={workingHours}/></span></TableRow>
    <TableRow> 
      <span> Expenses: <MoneyVisualizer amount={expenses.amt} hoursPerDay={24}/></span>
      <ul>
        { expenses.values.map( (expense, i) => {
          return <li key={i}> {expense.description}: <MoneyVisualizer amount={expense.charge} hoursPerDay={24}/></li>
        })}
      </ul>
    </TableRow>
    <TableRow> <span> Net Income: <MoneyVisualizer amount={ (job.wage * workingHours - expenses.amt * 24)/24} hoursPerDay={24} /> </span></TableRow>
  </>;
}

function App() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: 'auto'
    }}>
    <DataProviders>
      <DateTime/>
      <UserDisplay/>
      <Dashboard/>
      <Content/>
    </DataProviders>
    </div>
  );
}

export default App;
