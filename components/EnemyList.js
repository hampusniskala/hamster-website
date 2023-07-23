import React, { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";
import hamsterNftAbi from "../constants/BasicNft.json";

const EnemyList = () => {
  const [tokenId, setTokenId] = useState(0);
  const { user, Moralis } = useMoralis();
  const maxTokenId = 99;

  // Function to fetch the enemy NFTs not owned by the zero address and not owned by the connected account
  const fetchEnemyNFTs = async () => {
    try {
      const contract = new Moralis.web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
      const enemyNFTs = [];

      for (let i = 0; i <= maxTokenId; i++) {
        const owner = await contract.methods.ownerOf(i).call();
        if (owner.toLowerCase() !== '0x0000000000000000000000000000000000000000' && owner.toLowerCase() !== user.attributes.ethAddress.toLowerCase()) {
          enemyNFTs.push({ tokenId: i });
        }
      }

      if (enemyNFTs.length > 0) {
        setTokenId(enemyNFTs[0].tokenId);
      }
    } catch (error) {
      console.error('Error fetching enemy NFTs:', error);
    }
  };

  // Fetch enemy NFTs on component mount or when the user changes
  useEffect(() => {
    if (user) {
      fetchEnemyNFTs();
    }
  }, [user]);

  // Function to handle dropdown selection change
  const handleTokenChange = (event) => {
    const selectedTokenId = parseInt(event.target.value, 10);
    setTokenId(selectedTokenId);
  };

  return (
    <div>
      <label htmlFor="enemyTokenSelect">Select an Enemy NFT:</label>
      <select id="enemyTokenSelect" value={tokenId} onChange={handleTokenChange}>
        {/* Render dropdown options for enemy tokenIds not owned by zero address and connected account */}
        {Array.from({ length: maxTokenId + 1 }).map((_, index) => (
          <option key={index} value={index}>
            Enemy NFT {index}
          </option>
        ))}
      </select>
      <p>Selected Enemy Token ID: {tokenId}</p>
    </div>
  );
};

export default EnemyList;
