import { useState, useEffect } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card, Avatar } from "web3uikit"
import { ethers } from "ethers"

import hamsterNftAbi from "../constants/BasicNft.json"

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89"

export default function HamsterBox({ tokenId }) {
  const { isWeb3Enabled, account } = useMoralis()
  const [imageURI, setImageURI] = useState("")

  async function updateUI() {
    setImageURI(`../images/nobg/${tokenId}.png`)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI()
    }
  }, [isWeb3Enabled])

  return (
    <div>
      <div>
        {imageURI ? (
          <div style={{ width: "160px", height: "160px" }}>
            <div className="py-4 px-4">
              <Card>
                <Image
                  src={imageURI}
                  height="160"
                  width="160"
                  alt={`Hamster #${tokenId}`}
                />
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