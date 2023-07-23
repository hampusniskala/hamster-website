import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import favicon from "../images/verdomi_logo.png"
import HamsterMintBox from "../components/HamsterMint"
import HamsterBox from "../components/HamsterBox"
import HamsterList from "../components/HamsterList"
import EnemyList from "../components/EnemyList"
import { selectedEnemy } from "../components/EnemyList"
import { selectedHamster } from "../components/HamsterList"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Hamster Racing NFT</title>
                <meta name="description" content="Hamster Racing NFT" />
                <link rel="" href="https://hamsters.gg/" />
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
                <HamsterBox tokenId={selectedHamster} />
                <HamsterBox tokenId={selectedEnemy} />
            </div>
        </div>
    )
}
