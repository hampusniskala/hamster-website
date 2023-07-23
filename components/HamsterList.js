import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext";
import { Dropdown, Avatar } from "web3uikit";
import hamsterNftAbi from "../constants/BasicNft.json";

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";

export default function HamsterList() {
  const { selectedHamsterTokenId, setSelectedHamsterTokenId } = useHamsterContext();
  const { isWeb3Enabled, account } = useMoralis();
  const [hamsterList, setHamsterList] = useState([]);

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account]);

  async function updateUI() {
    const newHamsterList = [];
    for (let i = 0; i < 100; i++) {
      try {
        const contract = useWeb3Contract({
          abi: hamsterNftAbi,
          contractAddress: hamsterNftAddress,
          functionName: "ownerOf",
        });

        const owner = await contract.call({ tokenId: i });
        console.log(`Hamster #${i} Owner: ${owner}`);
        if (owner === account) {
          newHamsterList.push({
            id: i,
            label: `#${i}`,
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
          });
        }
      } catch (error) {
        console.error(`Error fetching owner of Hamster #${i}`, error);
      }
    }
    setHamsterList(newHamsterList);
    console.log("Hamster List:", newHamsterList);
  }

  async function handleHamsterSelect(tokenId) {
    setSelectedHamsterTokenId(tokenId);
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
  );
}
