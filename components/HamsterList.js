import React, { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";
import hamsterNftAbi from "../constants/BasicNft.json";

const HamsterList = () => {
  const [tokenId, setTokenId] = useState(0);
  const { user, Moralis } = useMoralis();
  const maxTokenId = 99;

  // Function to fetch the NFTs owned by the connected account
  const fetchNFTs = async () => {
    try {
      const contract = new Moralis.web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
      const ownedNFTs = [];

      for (let i = 0; i <= maxTokenId; i++) {
        const owner = await contract.methods.ownerOf(i).call();
        if (owner.toLowerCase() === user.attributes.ethAddress.toLowerCase()) {
          ownedNFTs.push({ tokenId: i });
        }
      }

      if (ownedNFTs.length > 0) {
        setTokenId(ownedNFTs[0].tokenId);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  // Fetch NFTs on component mount
  useEffect(() => {
    if (user) {
      fetchNFTs();
    }
  }, [user]);

  // Function to handle dropdown selection change
  const handleTokenChange = (event) => {
    const selectedTokenId = parseInt(event.target.value, 10);
    setTokenId(selectedTokenId);
  };

  return (
    <div>
      <label htmlFor="tokenSelect">Select an NFT:</label>
      <select id="tokenSelect" value={tokenId} onChange={handleTokenChange}>
        {/* Render dropdown options for tokenId 0 to maxTokenId */}
        {Array.from({ length: maxTokenId + 1 }).map((_, index) => (
          <option key={index} value={index}>
            NFT {index}
          </option>
        ))}
      </select>
      <p>Selected Token ID: {tokenId}</p>
    </div>
  );
};

export default HamsterList;
