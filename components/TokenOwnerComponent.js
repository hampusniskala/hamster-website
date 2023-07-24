// TokenOwnerComponent.js
import React from 'react';
import useOwnerOfToken from './useOwnerOfToken';

const TokenOwnerComponent = ({ tokenId }) => {
  const { owner } = useOwnerOfToken(tokenId);

  return <div>{owner}</div>;
};

export default TokenOwnerComponent;
