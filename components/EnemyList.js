import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext";
import { Dropdown, Avatar } from "web3uikit";
import { useOwnerOf } from "./useOwnerOf"; // Import the custom hook

export default function EnemyList() {
  const { isWeb3Enabled, account } = useMoralis();
  const { selectedHamsterTokenId } = useHamsterContext();
  const [enemyList, setEnemyList] = useState([]);

  const ownerOf = useOwnerOf(); // Use the custom hook

  useEffect(() => {
    async function updateEnemyList(selectedHamsterTokenId) {
      const newEnemyList = [];
      for (let i = 0; i < 100; i++) {
        try {
          // Update the tokenId parameter for the ownerOf function with the current value of i
          ownerOf.updateParams({ tokenId: i });

          const owner = await ownerOf();
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

    if (isWeb3Enabled && selectedHamsterTokenId !== null) {
      updateEnemyList(selectedHamsterTokenId);
    }
  }, [isWeb3Enabled, selectedHamsterTokenId, account, ownerOf]);

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
