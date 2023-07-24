import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';
import Image from 'next/image';

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

// Custom React Hook to fetch owned hamsters
const useOwnedHamsters = () => {
  const { user } = useMoralis();
  const [ownedHamsters, setOwnedHamsters] = useState([]);

  useEffect(() => {
    const fetchOwnedHamsters = async () => {
      const contract = useWeb3Contract(hamsterNftAddress, hamsterNftAbi);
      const ownedHamsters = [];
      for (let tokenId = 0; tokenId < 100; tokenId++) {
        const owner = await contract.methods.ownerOf(tokenId).call();
        if (owner === user.attributes.ethAddress) {
          ownedHamsters.push({ tokenId });
        }
      }
      setOwnedHamsters(ownedHamsters);
    };

    fetchOwnedHamsters();
  }, [user]);

  return ownedHamsters;
};

// Custom React Hook to fetch all hamsters
const useAllHamsters = () => {
  const { user } = useMoralis();
  const [allHamsters, setAllHamsters] = useState([]);

  useEffect(() => {
    const fetchAllHamsters = async () => {
      const contract = useWeb3Contract(hamsterNftAddress, hamsterNftAbi);
      const allHamsters = [];
      for (let tokenId = 0; tokenId < 100; tokenId++) {
        const owner = await contract.methods.ownerOf(tokenId).call();
        if (owner !== user.attributes.ethAddress && owner !== '0x0000000000000000000000000000000000000000') {
          allHamsters.push({ tokenId });
        }
      }
      setAllHamsters(allHamsters);
    };

    fetchAllHamsters();
  }, [user]);

  return allHamsters;
};

const HamsterSelector = ({ hamsters, onChange }) => {
  return (
    <div>
      <label htmlFor="selectHamster">Select Hamster:</label>
      <select id="selectHamster" onChange={(e) => onChange(e.target.value)}>
        <option value="">Select a hamster</option>
        {hamsters.map((hamster) => (
          <option key={hamster.tokenId} value={hamster.tokenId}>
            {hamster.tokenId}
          </option>
        ))}
      </select>
    </div>
  );
};

const EnemySelector = ({ hamsters, onChange }) => {
  return (
    <div>
      <label htmlFor="selectEnemy">Select Enemy:</label>
      <select id="selectEnemy" onChange={(e) => onChange(e.target.value)}>
        <option value="">Select an enemy</option>
        {hamsters.map((hamster) => (
          <option key={hamster.tokenId} value={hamster.tokenId}>
            {hamster.tokenId}
          </option>
        ))}
      </select>
    </div>
  );
};

const HamsterPage = () => {
  const ownedHamsters = useOwnedHamsters();
  const allHamsters = useAllHamsters();
  const [selectedHamster, setSelectedHamster] = useState('');
  const [selectedEnemy, setSelectedEnemy] = useState('');

  return (
    <div>
      <HamsterSelector hamsters={ownedHamsters} onChange={setSelectedHamster} />
      {selectedHamster && (
        <Image
          src={`/images/nobg/${selectedHamster}.png`}
          alt={`Hamster ${selectedHamster}`}
          width={200}
          height={200}
        />
      )}
      <EnemySelector hamsters={allHamsters} onChange={setSelectedEnemy} />
      {selectedEnemy && (
        <Image
          src={`/images/nobg/${selectedEnemy}.png`}
          alt={`Enemy ${selectedEnemy}`}
          width={200}
          height={200}
        />
      )}
    </div>
  );
};

export default HamsterPage;
