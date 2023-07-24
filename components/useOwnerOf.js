import { useWeb3Contract } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';
import { useMemo } from 'react';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const useOwnerOf = (tokenId) => {
  const contract = useMemo(
    () => new Moralis.web3.eth.Contract(hamsterNftAbi, hamsterNftAddress),
    []
  );

  const { runContractFunction: ownerOf } = useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
    functionName: 'ownerOf',
    params: {
      tokenId: tokenId,
    },
  });

  const fetchOwnerOf = async () => {
    try {
      const owner = await ownerOf();
      return owner;
    } catch (error) {
      console.error('Error fetching ownerOf:', error);
      return null;
    }
  };

  return fetchOwnerOf();
};

export default useOwnerOf;
