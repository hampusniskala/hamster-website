import React, { useState, useEffect } from 'react';
import { useMoralis, useMoralisWeb3Api } from 'react-moralis';

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";
import hamsterNftAbi from "../constants/BasicNft.json";

const HamsterList = () => {
  const [tokenId, setTokenId] = useState(0);
  const { account, isAuthenticated } = useMoralis();
  const { web3 } = useMoralisWeb3Api();
  const maxTokenId = 99;

  // Function to fetch the NFTs not owned by the connected account
  const fetchNFTs = async () => {
    try {
      if (!isAuthenticated || !account || !web3) return;

      const contract = new web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
      const ownedNFTs = [];

      for (let i = 0; i <= maxTokenId; i++) {
        const owner = await contract.methods.ownerOf(i).call();
        if (owner.toLowerCase() !== account.toLowerCase()) {
          ownedNFTs.push({ tokenId: i });
        }
      }

      if (ownedNFTs.length > 0) {
        setTokenId(ownedNFTs[0].tokenId);
      }

      setOwnedNFTs(ownedNFTs); // Store the filtered NFTs in state for rendering the dropdown options
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    }
  };

  const [ownedNFTs, setOwnedNFTs] = useState([]);

  // Fetch NFTs on Moralis initialization and when the account changes
  useEffect(() => {
    fetchNFTs();
  }, [isAuthenticated, account, web3]);

  // Function to handle dropdown selection change
  const handleTokenChange = (event) => {
    const selectedTokenId = parseInt(event.target.value, 10);
    setTokenId(selectedTokenId);
  };

  return (
    <div>
      <label htmlFor="tokenSelect">Select an NFT:</label>
      <select
        id="tokenSelect"
        value={tokenId}
        onChange={handleTokenChange}
        style={{ color: 'black' }} // Change text color to black for the select element
      >
        {/* Render dropdown options for NFTs not owned by the connected account */}
        {ownedNFTs.map((nft) => (
          <option
            key={nft.tokenId}
            value={nft.tokenId}
            style={{ color: 'black' }} // Change text color to black for the option elements
          >
            NFT {nft.tokenId}
          </option>
        ))}
      </select>
      <p>Selected Token ID: {tokenId}</p>
    </div>
  );
};

export default HamsterList;
