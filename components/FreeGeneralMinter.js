import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import generalMinterAbi from "../constants/GeneralMinter.json"
import { ConnectButton } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification, Form } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css"
import og_achievement from "../images/og_achievement.png"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    let separatorLength = separator.length
    const charsToShow = strLen - separatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
    )
}

export default function FreeGeneralBox({ price, nftAddress, tokenId }) {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    // General minter
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const generalMinterAddress = "0xfa20dB2c3C45f0925789ABD8682Fec53f9213A22"

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        // const tokenURI = "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/10"
        console.log(`The TokenURI is ${tokenURI}`)
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    const { runContractFunction } = useWeb3Contract()

    async function claimFreeMint(data) {
        console.log("Claiming free mint...")
        const _amount = parseInt(data.data[0].inputResult)
        let _vaultAddress = "0x0000000000000000000000000000000000000000"
        if (data.data[2].inputResult != "") {
            _vaultAddress = data.data[2].inputResult
        }

        let _freeMintAddress

        if (data.data[1].inputResult == "Bloot") {
            _freeMintAddress = "0x4F8730E0b32B04beaa5757e5aea3aeF970E5B613"
        } else if (data.data[1].inputResult == "PVFD") {
            _freeMintAddress = "0xd0A07a76746707f6D6d36D9d5897B14a8e9ED493"
        } else if (data.data[1].inputResult == "Legend-X") {
            _freeMintAddress = "0xd433F1601574B2288c32E60cCD2423384fCFd699"
        } else {
            _freeMintAddress = "0xcBb0A6C5Dae791c043efb306fB6b5460Aa25CC71"
        }

        const freeMintOptions = {
            abi: generalMinterAbi,
            contractAddress: generalMinterAddress,
            functionName: "claimFreeMint",
            params: {
                amount: _amount,
                freeMintAddress: _freeMintAddress,
                vaultAddress: _vaultAddress,
            },
        }

        await runContractFunction({
            params: freeMintOptions,
            onSuccess: handleFreeMintSuccess,
            onError: handleFreeMintError,
        })

        async function handleFreeMintSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Thanks for minting!",
                title: "Free NFT(s) has been claimed",
                position: "topR",
            })
        }

        async function handleFreeMintError(tx) {
            dispatch({
                type: "error",
                message: tx.message,
                title: "ERROR: Something went wrong",
                position: "topR",
            })
        }
    }

    return (
        <div>
            <div>
                {isWeb3Enabled ? (
                    <div className={styles.container}>
                        {/* Free claim starts here */}
                        <div className={styles.center}>
                            <Image src={og_achievement} width={500} height={500} />
                            <div className={styles.container}>
                                <Form
                                    onSubmit={claimFreeMint}
                                    data={[
                                        {
                                            name: "amount",
                                            options: ["1", "2", "3"],
                                            type: "radios",
                                            key: "_amount",
                                            validation: {
                                                required: true,
                                            },
                                        },
                                        {
                                            name: "freeMintAddress",
                                            options: ["Bloot", "PVFD", "Legend-X", "Test"],
                                            type: "radios",
                                            key: "_freeMintAddress",
                                            validation: {
                                                required: true,
                                            },
                                        },
                                        {
                                            name: "delegate.cash Vault Address (Optional)",
                                            type: "text",
                                            value: "",
                                            key: "_vaultAddress",
                                        },
                                    ]}
                                    title="Claim your FREE Egyptian(s)"
                                    id="Free Form"
                                />
                            </div>
                            {/* Free claim ends here */}
                        </div>
                    </div>
                ) : (
                    <div>
                        Connect your wallet to get started. <ConnectButton moralisAuth={false} />
                    </div>
                )}
            </div>
        </div>
    )
}
