import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import PaidGeneralBox from "../components/PaidGeneralMinter"
import favicon from "../images/verdomi_logo.png"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Verdomi</title>
                <meta name="description" content="Verdomi" />
                <link rel="" href="http://app.verdomi.com/" />
            </Head>
            <div>
                <PaidGeneralBox />
            </div>
            {/* <LotteryEntrance /> */}
            {/* header / connect button / nav bar */}
        </div>
    )
}
