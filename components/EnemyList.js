import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext";
import { Dropdown, Avatar } from "web3uikit";
import hamsterNftAbi from "../constants/BasicNft.json";

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";

export default function EnemyList() {
  const { isWeb3Enabled, account } = useMoralis();
  const { selectedHamsterTokenId } = useHamsterContext();
  const [enemyList, setEnemyList] = useState([]);

  useEffect(() => {
    if (isWeb3Enabled && account && selectedHamsterTokenId !== null) {
      updateEnemyList();
    }
  }, [isWeb3Enabled, account, selectedHamsterTokenId]);

  async function updateEnemyList() {
    const contract = useWeb3Contract({
      abi: hamsterNftAbi,
      contractAddress: hamsterNftAddress,
      functionName: "ownerOf",
    });

    const newEnemyList = [];
    for (let i = 0; i < 100; i++) {
      try {
        const owner = await contract.call({ tokenId: i });
        console.log(`Hamster #${i} Owner: ${owner}`);
        if (owner !== account && owner !== "0x0000000000000000000000000000000000000000") {
          newEnemyList.push({
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
    setEnemyList(newEnemyList);
    console.log("Enemy List:", newEnemyList);
  }

  const [selectedEnemyTokenId, setSelectedEnemyTokenId] = useState(null);
  async function handleEnemySelect(tokenId) {
    setSelectedEnemyTokenId(tokenId);
  }

  return (
    <div>
      <div>
        {account ? (
          <div>
            <div>Select which Hamster to challenge!</div>
            <Dropdown
              onChange={(e) => handleEnemySelect(e.id)}
              id="inputEnemy"
              label="Hamster: "
              options={enemyList}
            />
          </div>
        ) : (
          <div>Connect your wallet...</div>
        )}
      </div>
    </div>
  );
}
