import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card, useNotification, Avatar } from "web3uikit"
import { ethers } from "ethers"

import achievementsAbi from "../constants/Achievements.json"
const achievementsAddress = "0x3b0dEF175005Cd514b395A24bc79395B368Ac087"

export default function AchievementBox({ tokenId }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [ownedSymbol, setOwnedSymbol] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: achievementsAbi,
        contractAddress: achievementsAddress,
        functionName: "uri",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: balanceOf } = useWeb3Contract({
        abi: achievementsAbi,
        contractAddress: achievementsAddress,
        functionName: "balanceOf",
        params: {
            account: account,
            id: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(`The TokenURI is ${tokenURI}`)
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
        const balance = await balanceOf()
        if (balance > 0) {
            setOwnedSymbol("https://verdomi.com/images/check_symbol.png")
        } else {
            setOwnedSymbol("https://verdomi.com/images/cross_symbol.png")
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleCardClick = () => {
        const URL =
            "https://opensea.io/assets/ethereum/0x3b0def175005cd514b395a24bc79395b368ac087/" +
            tokenId
        window.open(URL, "_blank")
    }

    return (
        <div>
            <div>
                {imageURI ? (
                    <div
                        style={{
                            width: "300px",
                            height: "300px",
                        }}
                    >
                        <div className="py-4 px-4">
                            <Card
                                title={tokenName + " (#" + tokenId + ")"}
                                description={tokenDescription}
                                onClick={handleCardClick}
                            >
                                <div className="p-2">
                                    <div className="flex flex-col items-center gap-2">
                                        <Avatar image={ownedSymbol} theme="image" />
                                        <Image
                                            loader={() => imageURI}
                                            src={imageURI}
                                            height="200"
                                            width="200"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div>Connect your wallet...</div>
                )}
            </div>
        </div>
    )
}
