import React, { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import hamsterNftAbi from '../constants/BasicNft.json';

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

const HamsterPage = () => {
  const { user } = useMoralis();
  const [ownedHamsters, setOwnedHamsters] = useState([]);
  const [allHamsters, setAllHamsters] = useState([]);
  const [selectedHamster, setSelectedHamster] = useState('');
  const [selectedEnemy, setSelectedEnemy] = useState('');

  useEffect(() => {
    // Fetch all the NFTs owned by the connected account with tokenIds 0 to 99
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

    // Fetch all the NFTs with tokenIds 0 to 99 that are not owned by the connected account
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

    fetchOwnedHamsters();
    fetchAllHamsters();
  }, [user]);

  return (
    <div>
      <HamsterSelector hamsters={ownedHamsters} onChange={setSelectedHamster} />
      {selectedHamster && (
        <img
          src={`../images/nobg/${selectedHamster}.png`}
          alt={`Hamster ${selectedHamster}`}
        />
      )}
      <EnemySelector hamsters={allHamsters} onChange={setSelectedEnemy} />
      {selectedEnemy && (
        <img
          src={`../images/nobg/${selectedEnemy}.png`}
          alt={`Enemy ${selectedEnemy}`}
        />
      )}
    </div>
  );
};

export default HamsterPage;
