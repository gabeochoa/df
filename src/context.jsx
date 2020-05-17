import React, { useState, useContext } from 'react';
import { emptyfunction, money_format } from './utils';
import { JOBS } from './data';

const Flags = React.createContext({});
const UserInfo = React.createContext({});
const Resources = React.createContext({});
const ActivityData = React.createContext({});
const TimeData = React.createContext({});

const ActivityProvider = ({ children }) => {
  const [activites, setActivites] = useState([
    ["Sleep", 8, 0],
    ["Work", 8, 0],
    ["Eat", 3, 0],
    ["Chores", 0, 30],
    ["Slacking", 3, 0],
    ["Free Time", 1, 30],
  ]);
  const act_data = {
    activites, setActivites
  };
  return (
    <ActivityData.Provider value={act_data}>
      {children}
    </ActivityData.Provider>
  );
}

const TimeProvider = ({ children }) => {
  const [epoch, setEpoch] = useState(160578000000);
  const { job } = useContext(UserInfo);
  const date = new Date(epoch);
  const hour = date.getHours()
  const workStart = job.workStart;
  const workEnd = job.workEnd;
  const td_values = {
    epoch, setEpoch,
    date,
    workStart, workEnd,
    isWorkHours: hour >= workStart && hour <= workEnd,
    workingHours: 24 - (workEnd - workStart),
  }
  return <TimeData.Provider value={td_values}> {children} </TimeData.Provider>
}

const FlagProvider = ({ children }) => {
  const flag_info = {
    has_money: true,
    can_employ: false,
  }
  return <Flags.Provider value={flag_info}> {children} </Flags.Provider>;
}

const ResourcesProvider = ({ children }) => {
  const [money, setMoney] = useState(0);
  const none_format = (a) => a;
  const provider_values = {
    "money": { "value": money, "format": money_format, set: setMoney, show: true },
    "employees": { "value": 10, "format": none_format, set: emptyfunction, show: true }
  }
  return <Resources.Provider value={provider_values}>{children}</Resources.Provider>
}

const UserInfoProvider = ({ children }) => {
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
      amt: exps.map(e => e.charge).reduce((total, c) => total + c, 0)
    }, setExpenses,
  }
  return <UserInfo.Provider value={user_info}>{children}</UserInfo.Provider>;
}

const DataProviders = ({ children }) => {
  return (
    <ActivityProvider>
      <FlagProvider>
        <UserInfoProvider>
          <ResourcesProvider>
            <TimeProvider>
              {children}
            </TimeProvider>
          </ResourcesProvider>
        </UserInfoProvider>
      </FlagProvider>
    </ActivityProvider>
  );
}

export {
  TimeData,
  Resources,
  UserInfo,
  Flags,
  ActivityData,
  DataProviders,
}