import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Header from "../components/Header"

function MyApp({ Component, pageProps }) {
    return (
        <MoralisProvider initializeOnMount={false}>
            <NotificationProvider>
                <Header />
                <Component {...pageProps} />
                <style global jsx>{`
                    body {
                        background-color: #121212;
                    }
                    h1,
                    a,
                    div {
                        color: #ffffff;
                    }
                `}</style>
            </NotificationProvider>
        </MoralisProvider>
    )
}

export default MyApp
