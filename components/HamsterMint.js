import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
// import hamsterNftAbi from "../constants/HamsterRaceNFT.json"

import hamsterNftAbi from "../constants/BasicNft.json"


import { ConnectButton } from "web3uikit"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { Card, useNotification, Input, Button } from "web3uikit"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css"
import hamster_preview from "../images/hamster0.png"
import Link from "next/link"

export default function HamsterMintBox() {
    const { isWeb3Enabled, account, chainId } = useMoralis()
    const dispatch = useNotification()
    const [amountText, setAmountText] = useState("1")
    const [totalPriceText, setTotalPriceText] = useState("40")

    function updateUI() {
        // Calculate the total price based on the selected amount
        const priceForOne = 40; // You can change this if the price per NFT is different
        const totalAmount = parseInt(inputAmount.value, 10);
        setAmountText(totalAmount.toString());
    
        // Calculate the total price based on the selected amount
        const totalPrice = priceForOne * totalAmount;
        setTotalPriceText(totalPrice.toString());
      }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const { runContractFunction } = useWeb3Contract()

    async function allowHams(data) {
        console.log("Allowing HAMS to be moved...")

        const allowOptions = {
            abi: hamsAbi,
            contractAddress: hamsAddress,
            functionName: "approve",
            msgValue: 0,
            params: {
                spender: hamsterNftAddress,
                amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935,
            },
        }

        await runContractFunction({
            params: allowOptions,
            onSuccess: handleAllowSuccess,
            onError: handleAllowError,
        })

        async function handleAllowSuccess(tx) {
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "You are now able to mint!",
                title: "Success",
                position: "topR",
            })
        }

        async function handleAllowError(tx) {
            dispatch({
                type: "error",
                message: tx.message,
                title: "ERROR: Something went wrong",
                position: "bottomR",
            })
        }
    }

    async function mintHamster(data) {
        console.log("Minting...")
        const _amount = data
        const priceForOne = await getPriceForOne()
        const totalPrice = priceForOne * _amount * 10**18

        const paidMintOptions = {
            abi: hamsterNftAbi,
            contractAddress: hamsterNftAddress,
            functionName: "mint",
            msgValue: 0,
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
                                Mint a Hamster Racing NFT for 40 $HAMS
                            </h1>
                            <p className="py-2">
                                There are 100 total Hamster Racing NFTs. Challenge any other hamster to a race, 
                                if you win you get 30 $HAMS! The losing hamster gets burned forever!
                                Anyone can be challenged at any time. This means that your hamster could be burned
                                at any moment if it is challenged and loses. This also means that you could earn 
                                passive income if your hamster is challenged and you win! Its most fun to initate
                                the races yourself so you get to watch the hamster race.
                            </p>
                            <p className="py-2">
                                20% of all $HAMS collected from NFT sales are automatically added to the jackpot.
                                Once all 100 Hamsters have been minted and only one remains, the last hamster may claim
                                all of the $HAMS! (Over 800 $HAMS!!)
                                May the best racer win!
                            </p>

                            <div className="py-2">
                                <Image src={hamster_preview} width={640} height={640} />
                            </div>
                            <i className="py-1">
                                This is a fan-made project and has no affiliation with the hamsters.gg team.
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

                                <p className="py-2">
                                Before minting you will need to approve your $HAMS to be moved by the contract.
                                After minting you can revoke this access again.
                                </p>

                                <div className="py-2">
                                    <Button
                                        label="allowButton"
                                        text="Mint"
                                        onClick={() => allowHams()}
                                        theme="primary"
                                    />
                                </div>

                                <p className="py-4">
                                    You will mint {amountText} NFT for {totalPriceText} $HAMS
                                </p>

                                

                                <div className="py-2">
                                    <Button
                                        label="mintButton"
                                        text="Mint"
                                        onClick={() => mintHamster(inputAmount.value)}
                                        theme="primary"
                                    />
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
