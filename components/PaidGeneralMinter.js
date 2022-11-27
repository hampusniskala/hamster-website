import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import generalMinterAbi from "../constants/GeneralMinter.json"
import { ConnectButton } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification, Input, Button } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css"
import egyptians_preview from "../images/egyptians_preview.gif"
import Link from "next/link"

export default function PaidGeneralBox() {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const dispatch = useNotification()
    const [amountText, setAmountText] = useState("")
    const [totalPriceText, setTotalPriceText] = useState("")

    // Might be uselesss
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)

    // General minter
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const generalMinterAddress = "0xF1F51b1755a4cC627764ec62c8D2D2f4Ab765b00"

    const { runContractFunction: getPriceForOne } = useWeb3Contract({
        abi: generalMinterAbi,
        contractAddress: generalMinterAddress,
        functionName: "priceInEth",
        params: {},
    })

    async function updateUI() {
        const priceForOne = await getPriceForOne()
        console.log(`The price for one is ${priceForOne}`)
        setAmountText(inputAmount.value)

        const totalPrice = (priceForOne * inputAmount.value * 1.15) / 10 ** 18

        setTotalPriceText(Math.round(totalPrice * 100000) / 100000)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction } = useWeb3Contract()

    async function mintGeneral(data) {
        console.log("Minting...")
        const _amount = data
        const priceForOne = await getPriceForOne()
        const totalPrice = priceForOne * _amount * 1.15

        const paidMintOptions = {
            abi: generalMinterAbi,
            contractAddress: generalMinterAddress,
            functionName: "mintGeneral",
            msgValue: totalPrice,
            params: {
                amount: _amount,
            },
        }

        await runContractFunction({
            params: paidMintOptions,
            onSuccess: handlePaidMintSuccess,
            onError: handlePaidMintError,
        })

        async function handlePaidMintSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Thanks for minting!",
                title: "Your NFTs have been minted",
                position: "topR",
            })
        }

        async function handlePaidMintError(tx) {
            dispatch({
                type: "error",
                message: tx.message,
                title: "ERROR: Something went wrong",
                position: "bottomR",
            })
        }
    }

    return (
        <div>
            <div>
                {isWeb3Enabled ? (
                    <div className={styles.container}>
                        {/* Paid mint starts here */}
                        <div className={styles.center}>
                            <h1 className="py-2 px-4 font-bold text-3xl">
                                Mint an Egyptian General for $9
                            </h1>
                            <p className="py-2">
                                Mint an Egyptian General to lead your army in the upcoming
                                blockchain game! Thanks to Chainlink oracles, the price will always
                                be just $9!
                            </p>
                            <p className="py-2">
                                There are 2,000 Egyptains in total. Of these, 1,000 are male and
                                1,000 are female. There are also two 1/1 Egyptian GODS! (one female
                                and one male) Will you be the lucky owner?
                            </p>

                            <div className="py-2">
                                <Image src={egyptians_preview} width={488} height={632} />
                            </div>
                            <i className="py-1">
                                When minting through this website you will be sending rougly $10.35
                                per NFT in Ether, to make sure that your transaction goes through
                                even if the Ether price fluctuates. The remaining funds will be
                                automatically refunded in the same transaction! This ensures that
                                you only pay $9 no matter the current conversion rate!
                            </i>

                            <div className={styles.container}>
                                <div className="py-4">
                                    <Input
                                        id="inputAmount"
                                        label="Amount"
                                        placeholder="1"
                                        value="1"
                                        type="number"
                                        key="_amount"
                                        onChange={() => updateUI()}
                                        validation={{
                                            numberMax: 20,
                                            numberMin: 1,
                                        }}
                                    />
                                </div>
                                <p className="py-">
                                    You will mint {amountText} NFT for {totalPriceText} ETH which is
                                    {" $"}
                                    {amountText * 9}.
                                </p>

                                <div className="py-2">
                                    <Button
                                        label="mintButton"
                                        text="Mint"
                                        onClick={() => mintGeneral(inputAmount.value)}
                                        theme="primary"
                                    />
                                </div>
                                <div className="py-10">
                                    <div className={styles.clickable}>
                                        <Link href="/free-general-claim">
                                            <u className="text-xl font-bold">
                                                Looking for the Free Claim? Click here!
                                            </u>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {/* Paid mint ends here */}
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
