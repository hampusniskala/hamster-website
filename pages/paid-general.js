import styles from "../styles/Home.module.css"

import PaidGeneralBox from "../components/PaidGeneralMinter"

export default function Home() {
    return (
        <div className={styles.container}>
            <div>
                <PaidGeneralBox />
            </div>
        </div>
    )
}
