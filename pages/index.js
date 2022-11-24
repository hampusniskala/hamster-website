import Head from "next/head"
import styles from "../styles/Home.module.css"
//import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"
import FreeGeneralBox from "../components/FreeGeneralMinter"
import PaidGeneralBox from "../components/PaidGeneralMinter"
import favicon from "../images/verdomi_logo.png"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Verdomi</title>
                <meta name="description" content="Verdomi" />
                <link rel="icon" href={favicon} />
            </Head>
            <div>
                <PaidGeneralBox
                    price={5}
                    nftAddress={"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"}
                    tokenId={10}
                />
            </div>
            {/* <LotteryEntrance /> */}
            {/* header / connect button / nav bar */}
        </div>
    )
}
