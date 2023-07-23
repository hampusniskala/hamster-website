import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext";
import { Dropdown, Avatar } from "web3uikit";
import { useOwnerOf } from "./useOwnerOf"; // Import the custom hook

export default function HamsterList() {
  const { isWeb3Enabled, account } = useMoralis();
  const { selectedHamsterTokenId, setSelectedHamsterTokenId } = useHamsterContext();
  const [hamsterList, setHamsterList] = useState([]);

  const ownerOf = useOwnerOf(); // Use the custom hook

  useEffect(() => {
    async function updateUI() {
      const newHamsterList = [];
      for (let i = 0; i < 100; i++) {
        try {
          // Update the tokenId parameter for the ownerOf function with the current value of i
          ownerOf.updateParams({ tokenId: i });

          const owner = await ownerOf();
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

    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, account, ownerOf]);

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
