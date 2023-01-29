import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import offChainAbi from "../constants/OffChainAbi.json"
import { ConnectButton } from "web3uikit"
import Image from "next/image"
import { Card, useNotification, Input, Button } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css"
import OffChainApeGif from "../images/OffChainApe.gif"
import Link from "next/link"
import { StandardMerkleTree } from "@openzeppelin/merkle-tree"
import treeData from "../constants/OffChainApesTree.json"

export default function OffChainApeBox() {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const dispatch = useNotification()
    const [amountMintedText, setAmountMintedText] = useState("")

    const [idToBeMintedText, setIdToBeMintedText] = useState("")
    const [totalSupplyText, setTotalSupplyText] = useState("")
    const [unmintedId, setUnmintedId] = useState("")

    const [hasBeenMintedText, setHasBeenMintedText] = useState("")

    // Might be uselesss

    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)

    // General minter
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const offChainAddress = "0x516Aa883f9bCc8a1dbB1c24d316688B8230175Ab"

    const { runContractFunction: getTotalSupply } = useWeb3Contract({
        abi: offChainAbi,
        contractAddress: offChainAddress,
        functionName: "totalSupply",
        params: {},
    })

    const { runContractFunction: getUnminted } = useWeb3Contract({
        abi: offChainAbi,
        contractAddress: offChainAddress,
        functionName: "findUnminted",
        params: {},
    })

    const { runContractFunction: getAmount } = useWeb3Contract({
        abi: offChainAbi,
        contractAddress: offChainAddress,
        functionName: "getAmountMinted",
        params: { wallet: account },
    })

    async function updateIsMintedText() {
        let tokenId = inputTokenId.value
        if (tokenId == "") {
            tokenId = unmintedId
        }

        const options = {
            abi: offChainAbi,
            contractAddress: offChainAddress,
            functionName: "isMinted",
            msgValue: 0,
            params: {
                tokenId: tokenId,
            },
        }

        const isMinted = await runContractFunction({
            params: options,
        })

        if (isMinted) {
            setHasBeenMintedText("TokenId #" + tokenId + " has already been minted.")
            return true
        } else {
            setHasBeenMintedText("TokenId #" + tokenId + " is available!")
            return false
        }
    }

    function setTrueFalse() {
        if (hasBeenMintedText.includes("available")) {
            return false
        }
        return true
    }

    async function updateUI() {
        updateUnminted()
        const totalSupply = await getTotalSupply()
        setTotalSupplyText(totalSupply.toString())

        setIdToBeMintedText(inputTokenId.value)
        updateAmountMinted()
        updateIsMintedText()
    }

    async function updateUnminted() {
        const id = await getUnminted()
        setUnmintedId(id.toString())
    }

    async function updateAmountMinted() {
        const amount = await getAmount()
        setAmountMintedText(amount.toString())
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction } = useWeb3Contract()

    async function mintToken(data) {
        if (data == "") {
            data = unmintedId
        }
        console.log("Minting...")
        const _tokenId = data
        let _proof, _imageIpfs, _color

        const merkleTree = StandardMerkleTree.load(JSON.parse(JSON.stringify(treeData)))

        for (const [i, v] of merkleTree.entries()) {
            if (v[1] === _tokenId.toString()) {
                _proof = merkleTree.getProof(i)
                _imageIpfs = v[0]
                _color = v[2]
            }
        }

        const mintOptions = {
            abi: offChainAbi,
            contractAddress: offChainAddress,
            functionName: "mint",
            msgValue: 0,
            params: {
                proof: _proof,
                imageIpfs: _imageIpfs,
                tokenId: _tokenId,
                color: _color,
            },
        }

        await runContractFunction({
            params: mintOptions,
            onSuccess: handleMintSuccess,
            onError: handleMintError,
        })

        async function handleMintSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Thanks for minting!",
                title: "Your NFTs have been minted",
                position: "topR",
            })
        }

        async function handleMintError(tx) {
            let msg = tx.message
            if (msg.length > 100) {
                msg = "Maybe the tokenId has already been minted?"
            }

            dispatch({
                type: "error",
                message: msg,
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
                        {/* Mint starts here */}
                        <div className={styles.center}>
                            <h1 className="py-2 px-4 font-bold text-3xl">Mint an Off-Chain Ape</h1>
                            <p className="py-2">
                                The collection serves as an artistic expression on the lack of
                                on-chain storage for most NFT artwork. There is a 10% royalty on the
                                collection.
                            </p>
                            <p className="py-2">
                                Each wallet is allowed up to 10 mints. All mints are FREE + gas.
                            </p>
                            <div className={styles.clickable}>
                                <Link href="https://opensea.io/collection/offchainapes">
                                    <u className="text-l font-bold">
                                        View the collection on OpenSea!
                                    </u>
                                </Link>
                            </div>

                            <div className="py-2">
                                <Image src={OffChainApeGif} width={350} height={350} />
                            </div>

                            <div className={styles.container}>
                                <p className="py-">Total minted: {totalSupplyText} / 10000</p>
                                <p className="py-">You have minted: {amountMintedText} / 10</p>
                                <h2 className="py-2 px-4 font-bold text-l">
                                    ❗❗❗ You can only mint one token at a time. Enter the tokenId
                                    you wish to mint below. NOT the amount. ❗❗❗
                                </h2>
                                <div className="py-4">
                                    <Input
                                        id="inputTokenId"
                                        label="TokenId"
                                        placeholder={unmintedId}
                                        value={unmintedId}
                                        type="number"
                                        key="_tokenId"
                                        onChange={() => updateUI()}
                                        validation={{
                                            numberMax: 9999,
                                            numberMin: 0,
                                        }}
                                    />
                                </div>
                                <div
                                    className={`${
                                        setTrueFalse() ? styles.redText : styles.greenText
                                    }`}
                                >
                                    <p className="font-bold py-2">{hasBeenMintedText}</p>
                                </div>
                                <p className="py-">
                                    You will mint the NFT with tokenId #{idToBeMintedText} for 0 ETH
                                    + gas.
                                </p>

                                <div className="py-2">
                                    <Button
                                        label="mintButton"
                                        text="Mint"
                                        onClick={() => mintToken(inputTokenId.value)}
                                        theme="primary"
                                    />
                                </div>
                            </div>
                            {/* Mint ends here */}
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
