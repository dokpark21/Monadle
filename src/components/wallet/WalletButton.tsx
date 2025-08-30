"use client";

import React from 'react';
import styled from 'styled-components';
import { useMetaMask } from '@/hooks/useMetaMask';

const WalletContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

const ConnectButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isConnected', 'isLoading'].includes(prop),
})<{ isConnected: boolean; isLoading: boolean }>`
  background: ${props => 
    props.isConnected 
      ? 'linear-gradient(135deg, #10b981, #059669)' 
      : 'linear-gradient(135deg, #f97316, #ea580c)'
  };
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.isLoading ? 'wait' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  min-width: 160px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    ${props => !props.isConnected && !props.isLoading && `
      background: linear-gradient(135deg, #fb923c, #f97316);
    `}
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.isLoading && `
    animation: pulse 1.5s ease-in-out infinite;
    background: linear-gradient(135deg, #6b7280, #4b5563);
    cursor: wait;
  `}

  ${props => props.isConnected && `
    &:hover {
      background: linear-gradient(135deg, #059669, #047857);
    }
  `}

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MetaMaskIcon = styled.span`
  font-size: 16px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

const AccountInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px 12px;
  margin-top: 8px;
  color: white;
  font-size: 0.8rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  color: #fca5a5;
  font-size: 0.8rem;
  text-align: center;
  max-width: 200px;
`;

const DisconnectButton = styled.button`
  background: rgba(239, 68, 68, 0.8);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  margin-top: 4px;
  margin-right: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 1);
  }
`;

const ChangeAccountButton = styled.button`
  background: rgba(59, 130, 246, 0.8);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.7rem;
  cursor: pointer;
  margin-top: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(59, 130, 246, 1);
  }
`;

const WalletButton: React.FC = () => {
  const {
    isConnected,
    account,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled,
  } = useMetaMask();

  const handleConnect = () => {
    if (!isMetaMaskInstalled) {
      window.open('https://metamask.io/', '_blank');
      return;
    }
    connectWallet();
  };

  return (
    <WalletContainer>
      <ConnectButton
        onClick={handleConnect}
        isConnected={isConnected}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            연결 중...
          </>
        ) : isConnected ? (
          <>
            <MetaMaskIcon>🟢</MetaMaskIcon>
            연결됨
          </>
        ) : (
          <>
            <MetaMaskIcon>🦊</MetaMaskIcon>
            {isMetaMaskInstalled ? 'MetaMask 연결' : 'MetaMask 설치'}
          </>
        )}
      </ConnectButton>

      {isConnected && account && (
        <AccountInfo>
          <div>지갑 주소</div>
          <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
            {formatAddress(account)}
          </div>
          <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
            <ChangeAccountButton onClick={handleConnect}>
              계정 변경
            </ChangeAccountButton>
            <DisconnectButton onClick={disconnectWallet}>
              연결 해제
            </DisconnectButton>
          </div>
        </AccountInfo>
      )}

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </WalletContainer>
  );
};

export default WalletButton;
