import React, { useState, useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";
import hamsterNftAbi from "../constants/BasicNft.json";

const EnemyList = () => {
  const [tokenId, setTokenId] = useState(0);
  const { account, isAuthenticated } = useMoralis();
  const { web3 } = useMoralisWeb3Api();
  const maxTokenId = 99;

  // Function to fetch the enemy NFTs not owned by the zero address and not owned by the connected account
  const fetchEnemyNFTs = async () => {
    try {
      if (!isAuthenticated || !account || !web3) return;

      const contract = new web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
      const enemyNFTs = [];

      for (let i = 0; i <= maxTokenId; i++) {
        const owner = await contract.methods.ownerOf(i).call();
        if (owner.toLowerCase() !== '0x0000000000000000000000000000000000000000' && owner.toLowerCase() !== account.toLowerCase()) {
          enemyNFTs.push({ tokenId: i });
        }
      }

      if (enemyNFTs.length > 0) {
        setTokenId(enemyNFTs[0].tokenId);
      }

      setEnemyNFTs(enemyNFTs); // Store the filtered NFTs in state for rendering the dropdown options
    } catch (error) {
      console.error('Error fetching enemy NFTs:', error);
    }
  };

  const [enemyNFTs, setEnemyNFTs] = useState([]);

  // Fetch enemy NFTs on Moralis initialization and when the account changes
  useEffect(() => {
    fetchEnemyNFTs();
  }, [isAuthenticated, account, web3]);

  // Function to handle dropdown selection change
  const handleTokenChange = (event) => {
    const selectedTokenId = parseInt(event.target.value, 10);
    setTokenId(selectedTokenId);
  };

  return (
    <div>
      <label htmlFor="enemyTokenSelect">Select an Enemy NFT:</label>
      <select
        id="enemyTokenSelect"
        value={tokenId}
        onChange={handleTokenChange}
        style={{ color: 'black' }} // Change text color to black for the select element
      >
        {/* Render dropdown options for enemy tokenIds not owned by zero address and connected account */}
        {enemyNFTs.map((enemyNFT) => (
          <option
            key={enemyNFT.tokenId}
            value={enemyNFT.tokenId}
            style={{ color: 'black' }} // Change text color to black for the option elements
          >
            Enemy NFT {enemyNFT.tokenId}
          </option>
        ))}
      </select>
      <p>Selected Enemy Token ID: {tokenId}</p>
    </div>
  );
};

export default EnemyList;
