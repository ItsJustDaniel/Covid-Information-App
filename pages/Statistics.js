import styles from "../styles/statistics.module.css";
import BarChart from "../components/dataViz/BarChart";

const apiWorldStats =
  "https://covid.ourworldindata.org/data/owid-covid-data.json";

export async function getStaticProps() {
  const res = await fetch(`${apiWorldStats}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
    revalidate: 43200,
  };
}

//add commas to an number
function numberWithCommas(x) {
  console.log(x);
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//get most updated vaccine data
const checkLastVaccineData = (data) => {
  console.log(data);
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i].total_vaccinations) {
      return data[i].total_vaccinations;
    }
  }
};

const Statistics = ({ data }) => {
  // console.log(data);

  const world = data.OWID_WRL;
  const summary = world.data[world.data.length - 1];
  console.log(summary);
  console.log(world);

  const years = world.data.map((i) => new Date(i.date));
  //total cases graph
  const totalCases = world.data.map((i) => i.total_cases);
  //new cases
  const newCases = world.data.map((i) => i.new_cases);
  //new cases smoothed
  const newCasesSmoothed = world.data.map((i) => {
    if (i.new_cases_smoothed === undefined) {
      return i.new_cases;
    }
    return i.new_cases_smoothed;
  });

  //new deaths
  const newDeaths = world.data.map((i) => i.new_deaths);
  //new deaths smoothed
  const newDeathsSmoothed = world.data.map((i) => {
    if (i.new_deaths_smoothed === undefined) {
      return i.new_deaths;
    }
    return i.new_deaths_smoothed;
  });

  //total deaths
  const totalDeaths = world.data.map((i) => i.total_deaths);

  //vaccineYears
  const vaccineYears = world.data
    .filter((i) => i.total_vaccinations)
    .map((i) => new Date(i.date));
  //new vaccines
  const newVaccines = world.data.map((i) => i.new_vaccinations);
  //new vaccinations smoothed
  const newVaccinesSmoothed = world.data
    .filter((i) => i.total_vaccinations)
    .map((i) => {
      if (i.new_vaccinations === undefined) {
        return 0;
      }
      if (i.new_vaccinations_smoothed === undefined) {
        return i.new_vaccinations;
      }
      return i.new_vaccinations_smoothed;
    });
  console.log(vaccineYears.length);
  console.log(newVaccinesSmoothed);
  //total vaccines
  const totalVaccines = world.data.map((i) => i.total_vaccinations);

  const vaccine = checkLastVaccineData(world.data);
  return (
    <div>
      <h1 className="title">Statistics</h1>
      <div className={styles.summary__block__container}>
        <div className={styles.stats__block}>
          <h1>Confirmed:</h1>
          <h2>{numberWithCommas(summary.total_cases)}</h2>
        </div>
        <div className={styles.stats__block}>
          <h1>Deaths:</h1>
          <h2>{numberWithCommas(summary.total_deaths)}</h2>
        </div>
        <div className={styles.stats__block}>
          <h1>Vaccinated:</h1>
          <h2>{numberWithCommas(vaccine)}</h2>
        </div>
      </div>
      <BarChart
        data={world}
        X={years}
        Y={newCases}
        Name="New Cases"
        Value_Type="new_cases"
        Value_Category="Cases"
        smoothed={newCasesSmoothed}
      />
      <BarChart
        data={world}
        X={years}
        Y={totalCases}
        Name="Total Cases"
        Value_Type="total_cases"
        Value_Category="Cases"
      />
      <BarChart
        data={world}
        X={years}
        Y={newDeaths}
        Name="New Deaths"
        Value_Type="new_deaths"
        Value_Category="Deaths"
        smoothed={newDeathsSmoothed}
      />
      <BarChart
        data={world}
        X={years}
        Y={totalDeaths}
        Name="Total Deaths"
        Value_Type="total_deaths"
        Value_Category="Deaths"
      />

      <BarChart
        data={world}
        X={vaccineYears}
        Y={newVaccines}
        Name="New Vaccinations"
        Value_Type="new_vaccinations"
        Value_Category="Vaccines"
        smoothed={newVaccinesSmoothed}
      />
      <BarChart
        data={world}
        X={vaccineYears}
        Y={totalVaccines}
        Name="Total Vaccinations"
        Value_Type="total_vaccinations"
        Value_Category="Vacines"
      />
    </div>
  );
};

export default Statistics;
