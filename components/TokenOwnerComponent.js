// TokenOwnerComponent.js
import React from 'react';
import useOwnerOfToken from './useOwnerOfToken';

const TokenOwnerComponent = ({ tokenId }) => {
  const { owner } = useOwnerOfToken(tokenId);

  return owner;
};

export default TokenOwnerComponent;
