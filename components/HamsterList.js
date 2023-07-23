import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card, useNotification, Avatar, Dropdown, Input, Button  } from "web3uikit"
import { ethers } from "ethers"

//import hamsterNftAbi from "../constants/HamsterRaceNFT.json"

import hamsterNftAbi from "../constants/BasicNft.json"


const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89"

export var selectedHamster

export default async function HamsterList({ tokenId }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")

    const { runContractFunction: ownerOf } = useWeb3Contract({
        abi: hamsterNftAbi,
        contractAddress: hamsterNftAddress,
        functionName: "ownerOf",
        params: {
            tokenId: tokenId,
        },
    })
    
    hamsterList = []

    for (let i = 0; i < 100; i++) {
    
        const owner = await ownerOf(i)
        if(owner == account){
            hamsterList.push({
                id: i,
                label: `Hamster #${i}`,
                prefix: (
                    <Avatar
                        avatarKey={3}
                        borderRadius={7.5}
                        fontSize={8}
                        size={24}
                        image={`../images/nobg/${i}.png`}
                        theme="image"
                    />
                ),
            },)
        }
    
        
    }

    const [selectedHamster, setSelectedHamster] = useState("")
    async function handleHamsterSelect(tokenId) {
        setSelectedHamster(tokenId)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div>
                {account ? (
                    <div>
                    <div>
                        Select your Hamster to race!
                    </div>
                    <Dropdown
                        onChange={(e) => handleHamsterSelect(e.id)}
                        onComplete={function noRefCheck() {}}
                        id="inputHamster"
                        label="Hamster: "
                        options={hamsterList}
                    />
                    </div>
                ) : (
                    <div>Connect your wallet...</div>
                )}
            </div>
        </div>
    )
}



