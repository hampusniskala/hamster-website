// useOwnerOfToken.js
import { useWeb3Contract } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const useOwnerOfToken = (tokenId) => {
  const { user } = useMoralis();

  const { data, error } = useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
    functionName: 'ownerOf',
    params: {
      tokenId: tokenId,
    },
  });

  return {
    owner: data || null,
    error,
  };
};

export default useOwnerOfToken;
