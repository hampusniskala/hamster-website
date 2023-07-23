import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card, Avatar, Dropdown } from "web3uikit"
import { ethers } from "ethers"

import hamsterNftAbi from "../constants/BasicNft.json"

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89"

export default function HamsterList({ tokenId }) {
  const { isWeb3Enabled, account } = useMoralis()
  const [hamsterList, setHamsterList] = useState([])

  const { runContractFunction: ownerOf } = useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
    functionName: "ownerOf",
    params: {
      tokenId: tokenId,
    },
  })

  async function updateUI() {
    const newHamsterList = []
    for (let i = 0; i < 100; i++) {
      const owner = await ownerOf(i)
      if (owner === account) {
        newHamsterList.push({
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
        })
      }
    }
    setHamsterList(newHamsterList)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  const [selectedHamster, setSelectedHamster] = useState("")
  function handleHamsterSelect(tokenId) {
    setSelectedHamster(tokenId)
  }

  return (
    <div>
      <div>
        {account ? (
          <div>
            <div>Select your Hamster to race!</div>
            <Dropdown
              onChange={(e) => handleHamsterSelect(e.id)}
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