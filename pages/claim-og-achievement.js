import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { Form, useNotification, Button } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import ogClaimerAbi from "../constants/ogClaimerAbi.json"
import og_achievement from "../images/og_achievement.png"

export default function Home() {
    const { chainId, account } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const ogClaimerAddress = "0x4ae3A4831Eddd4bd70B36418EDa88BA6cCad332A"
    const dispatch = useNotification()

    const { runContractFunction } = useWeb3Contract()

    const { runContractFunction: claimAchievement } = useWeb3Contract({
        abi: ogClaimerAbi,
        contractAddress: ogClaimerAddress,
        functionName: "claimAchievement",
        msgValue: 0,
        params: {},
    })

    return (
        <div className={styles.container}>
            <div className={styles.center}>
                <Image src={og_achievement} width={500} height={500} />
                <Button
                    text="Claim OG Achievement"
                    onClick={claimAchievement}
                    size="large"
                    theme="primary"
                />
            </div>
            <div className={styles.center}></div>
        </div>
    )
}
