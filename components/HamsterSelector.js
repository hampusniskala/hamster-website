import React, { useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import useOwnerOfToken from './useOwnerOfToken';

import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const HamsterPage = () => {
  const { user, Moralis, isWeb3Enabled } = useMoralis();
  const [ownedTokenIds, setOwnedTokenIds] = useState([]);

  useEffect(() => {
      console.log("gello")
      console.log(isWeb3Enabled)
    const fetchOwnedTokenIds = async () => {
      if (isWeb3Enabled) {
          console.log("Web3 detected")

        // Get the connected wallet address
        const userAddress = user.get('ethAddress');
        console.log("address: ", userAddress)

        // Get the total supply of tokens
        const totalSupply = 100
        console.log("totalSupply: ", totalSupply)

        // Fetch the token IDs owned by the user
        const ownedTokenIds = [];

        for (let i = 0; i < totalSupply; i++) {
          const tokenId = i
          const owner = useOwnerOfToken(tokenId)

          if (owner.toLowerCase() === userAddress.toLowerCase()) {
            ownedTokenIds.push(tokenId);
          }
        }

        setOwnedTokenIds(ownedTokenIds);
      }
    };

    fetchOwnedTokenIds();
  }, [isWeb3Enabled]);

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
