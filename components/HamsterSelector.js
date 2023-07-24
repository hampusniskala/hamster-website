import React, { useState, useEffect } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';

import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';



const HamsterPage = () => {
    const { runContractFunction: ownerOf } = useWeb3Contract({
      abi: hamsterNftAbi,
      contractAddress: hamsterNftAddress,
      functionName: "ownerOf",
      params: {
        tokenId: 0, // We'll replace this with a different value each time
      },
    });
  
    const { account, isWeb3Enabled } = useMoralis();
    const [ownedTokenIds, setOwnedTokenIds] = useState([]);
  
    useEffect(() => {
      const fetchOwnedTokenIds = async () => {
        if (isWeb3Enabled) {
          // Get the connected wallet address
          const userAddress = account;
  
          // Get the total supply of tokens
          const totalSupply = 100;
  
          // Fetch the token IDs owned by the user
          const ownedTokenIds = [];
  
          const fetchOwners = [];
          for (let i = 0; i < totalSupply; i++) {
            const tokenId = i;
            fetchOwners.push(getOwner(tokenId));
          }
  
          Promise.all(fetchOwners)
            .then((owners) => {
              for (let i = 0; i < totalSupply; i++) {
                const owner = owners[i];
                console.log(i, owner)
                if (owner === userAddress) {
                  ownedTokenIds.push(i);
                }
              }
              setOwnedTokenIds(ownedTokenIds);
            })
            .catch((error) => {
              console.error('Error fetching owners:', error);
            });
        }
      };
  
      fetchOwnedTokenIds();
    }, [account, isWeb3Enabled]);
  
    async function getOwner(tokenId) {
      const result = await ownerOf({
        abi: hamsterNftAbi,
        contractAddress: hamsterNftAddress,
        functionName: "ownerOf",
        params: {
          tokenId: tokenId, // We'll replace this with a different value each time
        },
      });
      return result;
    }
  
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