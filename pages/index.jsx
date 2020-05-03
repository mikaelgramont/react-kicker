import Head from 'next/head';
import { observable } from "mobx";
import { observer } from "mobx-react-lite";

import Slider from '../components/Slider';
import styles from '../styles/home.module.scss';

const title = 'React Kicker';

const appState = observable({
  height: 1.0,
  width: 1.2,
  radius: 45,
});

const Main = observer(({ appState }) => {
  const { height, width, radius, } = appState;

  const onHeightChange = (e) => {appState.height = e.currentTarget.value; };
  const onWidthChange = (e) => { appState.width = e.currentTarget.value; };
  const onRadiusChange = (e) => { appState.radius = e.currentTarget.value; };

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <h1 className="title">{title}</h1>

        <div className={styles.input}>
          <Slider onChange={onHeightChange} className={styles.slider} label="height" id="height" name="height" min={0.5} max={3} value={height} />
          <Slider onChange={onWidthChange} className={styles.slider} label="width" id="width" name="width" min={0.5} max={3} value={width} />
          <Slider onChange={onRadiusChange} className={styles.slider} label="radius" id="radius" name="radius" min={30} max={89} value={radius}/>
        </div>

        <div className={styles.output}>

        </div>

        <canvas className={styles.canvas}></canvas>
      </main>
    </div>
  );
});

export default function Home() {
  return <Main appState={appState} />;
}
