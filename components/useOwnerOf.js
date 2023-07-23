import { useWeb3Contract } from "react-moralis";
import hamsterNftAbi from "../constants/BasicNft.json";

const hamsterNftAddress = "0x5726c14663a1ead4a7d320e8a653c9710b2a2e89";

export function useOwnerOf() {
  return useWeb3Contract({
    abi: hamsterNftAbi,
    contractAddress: hamsterNftAddress,
    functionName: "ownerOf",
  });
}
