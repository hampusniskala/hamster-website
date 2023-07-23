import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { useHamsterContext } from "./HamsterContext";
import { Dropdown, Avatar } from "web3uikit";
import { useHamsterContract } from "../hooks/useHamsterContract";

export default function HamsterList() {
  const { selectedHamsterTokenId, setSelectedHamsterTokenId } = useHamsterContext();
  const { isWeb3Enabled, account } = useMoralis();
  const [hamsterList, setHamsterList] = useState([]);
  const { ownerOf } = useHamsterContract(); // Use the custom hook

  async function updateUI() {
    const newHamsterList = [];
    for (let i = 0; i < 100; i++) {
      const owner = await ownerOf(i);
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
    }
    setHamsterList(newHamsterList);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

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
