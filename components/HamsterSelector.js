import React, { useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';

import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const HamsterPage = () => {
  const { user, Moralis, isWeb3Enabled } = useMoralis();
  const [ownedTokenIds, setOwnedTokenIds] = useState([]);

  useEffect(() => {
    const fetchOwnedTokenIds = async () => {
      if (isWeb3Enabled) {
          console.log("Web3 detected")
        // Create a Web3 contract instance
        const contract = new Moralis.web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
        console.log("contract: ", contract)

        // Get the connected wallet address
        const userAddress = user.get('ethAddress');
        console.log("address: ", userAddress)

        // Get the total supply of tokens
        const totalSupply = await contract.methods.totalSupply().call();
        console.log("totalSupply: ", totalSupply)

        // Fetch the token IDs owned by the user
        const ownedTokenIds = [];

        for (let i = 0; i < totalSupply; i++) {
          const tokenId = await contract.methods.tokenByIndex(i).call();
          const owner = await contract.methods.ownerOf(tokenId).call();

          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            ownedTokenIds.push(tokenId);
          }
        }

        setOwnedTokenIds(ownedTokenIds);
      }
    };

    fetchOwnedTokenIds();
  }, [user, Moralis]);

  return (
    <div>
      <h1>Owned Token IDs</h1>
      <ul>
        {ownedTokenIds.map((tokenId) => (
          <li key={tokenId}>{tokenId}</li>
        ))}
      </ul>
    </div>
  );
};

export default HamsterPage;
