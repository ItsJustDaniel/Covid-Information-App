import styles from "../styles/statistics.module.css";
import BarChart from "../components/dataViz/BarChart";
import { useState } from "react";

export const getStaticProps = async () => {
  //fetch backend
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://covid-information-app.vercel.app/api/info"
      : "http://localhost:3000/api/info";
  const res = await fetch(baseUrl);
  const covid = await res.json();
  if (!covid) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      covid,
    },
    revalidate: 43200,
  };
};

//add commas to an number
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//get most updated vaccine data
const checkLastVaccineData = (data) => {
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i].total_vaccinations) {
      return data[i].total_vaccinations;
    }
  }
};

const Statistics = ({ covid }) => {
  const data = covid.data[0];

  const world = data.summary;
  const summary = world[world.length - 1];

  const vaccineData = world.filter((i) => i.new_vaccinations);

  const years = world.map((i) => new Date(i.date));
  //total cases graph
  const totalCases = world.map((i) => i.total_cases);
  //new cases
  const newCases = world.map((i) => i.new_cases);
  //new cases smoothed
  const newCasesSmoothed = world.map((i) => {
    if (i.new_cases_smoothed === undefined) {
      return i.new_cases;
    }
    return i.new_cases_smoothed;
  });

  //new deaths
  const newDeaths = world.map((i) => i.new_deaths);
  //new deaths smoothed
  const newDeathsSmoothed = world.map((i) => {
    if (i.new_deaths_smoothed === undefined) {
      return i.new_deaths;
    }
    return i.new_deaths_smoothed;
  });

  //total deaths
  const totalDeaths = world.map((i) => i.total_deaths);

  //vaccineYears
  const vaccineYears = world
    .filter((i) => i.total_vaccinations)
    .map((i) => new Date(i.date));

  //newVaccineYears
  const newVaccineYears = world
    .filter((i) => i.new_vaccinations)
    .map((i) => new Date(i.date)); //new vaccines
  const newVaccines = world
    .filter((i) => i.new_vaccinations)
    .map((i) => i.new_vaccinations);

  //new vaccinations smoothed
  const newVaccinesSmoothed = world
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
  //total vaccines
  const totalVaccines = world
    .filter((i) => i.total_vaccinations)
    .map((i) => i.total_vaccinations);
  const vaccine = checkLastVaccineData(world);
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
        smoothed={null}
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
        smoothed={null}
      />
      <BarChart
        data={vaccineData}
        X={newVaccineYears}
        Y={newVaccines}
        Name="New Vaccinations"
        Value_Type="new_vaccinations"
        Value_Category="Vaccines"
        smoothed={newVaccinesSmoothed}
      />
      <BarChart
        data={vaccineData}
        X={vaccineYears}
        Y={totalVaccines}
        Name="Total Vaccinations"
        Value_Type="total_vaccinations"
        Value_Category="Vacines"
        smoothed={null}
      />
    </div>
  );
};
export default Statistics;
