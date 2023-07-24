import React, { useState, useEffect, useMemo } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';
import Image from 'next/image';
import useOwnerOf from './useOwnerOf'; 

const hamsterNftAddress = '0x5726c14663a1ead4a7d320e8a653c9710b2a2e89';

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

const useContractInstance = () => {
  const { Moralis } = useMoralis();

  const contractInstance = useMemo(() => {
    if (Moralis) {
      return new Moralis.web3.eth.Contract(hamsterNftAbi, hamsterNftAddress);
    }
    return null;
  }, [Moralis]);

  return contractInstance;
};

const fetchHamsters = async (contract, user) => {
    const ownedHamsters = [];
    const allHamsters = [];
  
    for (let tokenId = 0; tokenId < 100; tokenId++) {
      const owner = await useOwnerOf(tokenId); // Await the result of useOwnerOf function
  
      if (owner === user.attributes.ethAddress) {
        ownedHamsters.push({ tokenId });
      } else if (owner !== '0x0000000000000000000000000000000000000000') {
        allHamsters.push({ tokenId });
      }
    }
  
    return { ownedHamsters, allHamsters };
  };

const HamsterPage = () => {
  const { user, isWeb3Enabled } = useMoralis();
  const contract = useContractInstance();

  const [ownedHamsters, setOwnedHamsters] = useState([]);
  const [allHamsters, setAllHamsters] = useState([]);
  const [selectedHamster, setSelectedHamster] = useState('');
  const [selectedEnemy, setSelectedEnemy] = useState('');

  useEffect(() => {
    const loadHamsters = async () => {
      if (isWeb3Enabled && contract) {
        const { ownedHamsters, allHamsters } = await fetchHamsters(contract, user);
        setOwnedHamsters(ownedHamsters);
        setAllHamsters(allHamsters);
      }
    };

    loadHamsters();
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
