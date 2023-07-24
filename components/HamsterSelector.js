import React, { useState, useEffect, useMemo } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import Image from 'next/image';

import hamsterNftAbi from '../constants/BasicNft.json';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

const HamsterSelector = ({ hamsters, onChange }) => {
  // ... (rest of the code remains the same)
};

const EnemySelector = ({ hamsters, onChange }) => {
  // ... (rest of the code remains the same)
};

const useContractInstance = () => {
  // ... (rest of the code remains the same)
};

const useOwnerOfToken = (contract, tokenId, user) => {
  const { isWeb3Enabled } = useMoralis();
  const [owner, setOwner] = useState('');

  useEffect(() => {
    const fetchOwner = async () => {
      if (isWeb3Enabled && contract && user) {
        const { runContractFunction } = useWeb3Contract({
          abi: hamsterNftAbi,
          contractAddress: hamsterNftAddress,
          functionName: 'ownerOf',
          params: {
            tokenId: tokenId,
          },
        });

        const owner = await runContractFunction();

        setOwner(owner);
      }
    };

    fetchOwner();
  }, [isWeb3Enabled, contract, tokenId, user]);

  return { owner };
};

const HamsterPage = () => {
  const { user, isWeb3Enabled } = useMoralis();
  const contract = useContractInstance();

  const [ownedHamsters, setOwnedHamsters] = useState([]);
  const [allHamsters, setAllHamsters] = useState([]);
  const [selectedHamster, setSelectedHamster] = useState('');
  const [selectedEnemy, setSelectedEnemy] = useState('');

  useEffect(() => {
    const fetchHamsters = async () => {
      const ownedHamsters = [];
      const allHamsters = [];

      for (let tokenId = 0; tokenId < 100; tokenId++) {
        const { owner } = await useOwnerOfToken(contract, tokenId, user); // Fetch owner using the custom hook here

        if (owner === user.attributes.ethAddress) {
          ownedHamsters.push({ tokenId });
        } else if (owner !== '0x0000000000000000000000000000000000000000') {
          allHamsters.push({ tokenId });
        }
      }

      setOwnedHamsters(ownedHamsters);
      setAllHamsters(allHamsters);
    };

    if (isWeb3Enabled && contract) {
      fetchHamsters();
    }
  }, [isWeb3Enabled, contract, user]);

  return (
    <div>
      <HamsterSelector hamsters={ownedHamsters} onChange={setSelectedHamster} />
      {selectedHamster && (
        <Image
          src={`../images/nobg/${selectedHamster}.png`}
          alt={`Hamster ${selectedHamster}`}
          width={200}
          height={200}
        />
      )}
      <EnemySelector hamsters={allHamsters} onChange={setSelectedEnemy} />
      {selectedEnemy && (
        <Image
          src={`../images/nobg/${selectedEnemy}.png`}
          alt={`Enemy ${selectedEnemy}`}
          width={200}
          height={200}
        />
      )}
    </div>
  );
};

export default HamsterPage;
