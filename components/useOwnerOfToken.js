// useOwnerOfToken.js

import { useWeb3Contract } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const useOwnerOfToken = (tokenId) => {
  const { contract, contractState } = useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
  });

  // Fetch the owner synchronously
  const owner = contractState?.value.ownerOf[tokenId] || null;

  return {
    owner,
    contract,
    contractState,
  };
};

export default useOwnerOfToken;
