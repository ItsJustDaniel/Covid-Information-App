import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Covid Information || Home</title>

        <meta
          property="og:url"
          content="https://covid-information-app.vercel.app/"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Covid Information" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:description"
          content="Covid app that details information and statistics of covid-19"
        />
        <meta
          property="og:image"
          content="https://github.com/ItsJustDaniel/personal-website-2/blob/main/public/images/projects/Covid%20Information.PNG"
        />
      </Head>
      <div className={styles.hero__container}>
        <div className={styles.hero__desc}>
          <h1>Covid-19 Information Site</h1>
          <p>
            A Website containing information about covid-19 with up-to-date
            statistics and data visualisations.
          </p>
        </div>
        <button className={styles.button}>READ MORE</button>
      </div>
      <div className="block">
        <h1>What Is Covid?</h1>
        <p>
          Coronavirus disease (COVID-19) is an infectious disease caused by the
          SARS-CoV-2 virus. Most people who fall sick with COVID-19 will
          experience mild to moderate symptoms and recover without special
          treatment. However, some will become seriously ill and require medical
          attention.
        </p>
      </div>
      <div className="block">
        <h1>How it Spreads</h1>
        <p>
          The virus can spread from an infected person’s mouth or nose in small
          liquid particles when they cough, sneeze, speak, sing or breathe.
          These particles range from larger respiratory droplets to smaller
          aerosols.
        </p>
        <p>
          You can be infected by breathing in the virus if you are near someone
          who has COVID-19, or by touching a contaminated surface and then your
          eyes, nose or mouth. The virus spreads more easily indoors and in
          crowded settings.
        </p>
      </div>
      <div className={styles.button__container}>
        <button className={styles.button}>More Information</button>
      </div>
    </div>
  );
}
