import ChoroplethMap from "../components/dataViz/ChoroplethMap";
import styles from "../styles/map.module.css";
import { useState, useEffect } from "react";

export const getStaticProps = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  );
  const data = await res.json();

  const resCovid = await fetch(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/latest/owid-covid-latest.json"
  );

  const dataCovid = await resCovid.json();

  // create locations
  let locations = [];
  let errors = [];
  for (let i = 0; i < data.features.length; i++) {
    if (dataCovid[data.features[i].id]) {
      locations.push(dataCovid[data.features[i].id]);
    } else {
      errors.push(data.features[i]);
    }
  }
  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
      locations,
      dataCovid,
      errors,
    },
    revalidate: 43200,
  };
};

const Map = ({ data, locations, dataCovid, errors, Api }) => {
  return (
    <div>
      <h1 className={styles.map__title}>Map</h1>
      <ChoroplethMap data={data} locations={locations} covid={dataCovid} />
    </div>
  );
};

export default Map;
