
const cartel_jobs = [
  [
    "Corner Dealer", "standing around",
    20, 0,
    8, 18,
  ],
  [
    "Street Boss", "making sure no dealers are skimming",
    100, 20,
    8, 18,
  ],
  [
    "Consierge Dealer", "making house calls",
    1000, 0,
    10, 16,
  ],
  [
    "Cartel Underboss", "managing the streets from the SUV",
    1000, 100,
    8, 18,
  ],
  [
    "Cartel Boss", "el jefe",
    100000, 1000,
    0, 24,
  ],
]

const basic = [
  ["Unemployed",
    "watching netflix",
    0, 0,
    0, 24,
  ],
  [
    "Handyman",
    "helping out around the neighborhood",
    10, 0,
    8, 18,
  ],
]

const jobdata = [
  ...basic,
  ...cartel_jobs,
]

const JOBS = {};
jobdata.forEach((item) => {
  const [
    title,
    description,
    wage, wage_per_emp,
    workStart, workEnd
  ] = item;
  JOBS[item[0].toUpperCase()] = {
    title,
    description,
    wage, wage_per_emp,
    workStart, workEnd
  }
});


export {
  JOBS,
}