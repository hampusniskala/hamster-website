import styles from "../styles/Home.module.css"

import FreeGeneralBox from "../components/FreeGeneralMinter"

export default function Home() {
    return (
        <div className={styles.container}>
            <div>
                <FreeGeneralBox />
            </div>
        </div>
    )
}
