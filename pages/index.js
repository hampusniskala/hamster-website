import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Verdomi</title>
                <meta name="description" content="Verdomi" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <LotteryEntrance />
            {/* header / connect button / nav bar*/}
        </div>
    )
}
