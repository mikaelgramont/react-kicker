import Head from 'next/head'

import Slider from '../components/Slider';
import styles from '../styles/home.module.css';

const title = 'React Kicker';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <h1 className="title">{title}</h1>

        <div className={styles.input}>
          <Slider className={styles.slider} label="height" id="height" name="height" min={0.5} max={3} value={1.0} />
          <Slider className={styles.slider} label="width" id="width" name="width" min={0.5} max={3} value={1.2} />
          <Slider className={styles.slider} label="radius" id="radius" name="radius" min={30} max={89} value={45}/>
        </div>

        <div className={styles.output}>

        </div>

        <canvas className={styles.canvas}></canvas>
      </main>
    </div>
  )
}
