import { useState, useEffect } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext"; // Import the useHamsterContext hook from the correct path
import { Dropdown, Avatar } from "web3uikit"; // Import the Avatar component

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";

export default function EnemyList() {
  const { isWeb3Enabled, account } = useMoralis();
  const { selectedHamsterTokenId } = useHamsterContext(); // Use the context to access the selectedHamsterTokenId
  const [enemyList, setEnemyList] = useState([]);

  const { runContractFunction: ownerOf } = useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
    functionName: "ownerOf",
  });

  useEffect(() => {
    if (isWeb3Enabled && selectedHamsterTokenId !== null) {
      updateEnemyList(selectedHamsterTokenId);
    }
  }, [isWeb3Enabled, selectedHamsterTokenId]);

  async function updateEnemyList(selectedHamsterTokenId) {
    const enemies = [];

    for (let i = 0; i < 100; i++) {
      const owner = await ownerOf(i);
      if (owner !== account && owner !== "0x0000000000000000000000000000000000000000") {
        enemies.push({
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
    }

    setEnemyList(enemies);
  }

  const [selectedEnemyTokenId, setSelectedEnemyTokenId] = useState(null);
  async function handleEnemySelect(tokenId) {
    setSelectedEnemyTokenId(tokenId);
  }

  return (
    <div>
      <HamsterProvider> {/* Wrap the EnemyList component with the HamsterProvider */}
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
      </HamsterProvider>
    </div>
  );
}
