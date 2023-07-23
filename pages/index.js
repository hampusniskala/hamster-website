import Head from "next/head";
import styles from "../styles/Home.module.css";
import { HamsterProvider } from "../components/HamsterContext";
import HamsterMintBox from "../components/HamsterMint";
import HamsterBox from "../components/HamsterBox";
import HamsterList from "../components/HamsterList";
import EnemyList from "../components/EnemyList";

export default function Home() {
  return (
    <HamsterProvider>
      <div className={styles.container}>
        <Head>
          {/* ... */}
        </Head>
        <div>
          <HamsterMintBox />
        </div>
        <div className="py-4">
          <h1>Hamster Race!</h1>
        </div>
        <HamsterList />
        <EnemyList />
        <div className="py-4">
        <HamsterBox tokenId={selectedHamsterTokenId} />
        <HamsterBox tokenId={selectedEnemyTokenId} />
        </div>
      </div>
    </HamsterProvider>
  );
}
