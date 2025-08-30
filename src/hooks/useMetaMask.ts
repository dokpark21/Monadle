"use client";

import { useState, useEffect, useCallback } from 'react';

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useMetaMask = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    isLoading: false,
    error: null,
  });

  // MetaMask가 설치되어 있는지 확인
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // 계정 연결 확인
  const checkConnection = useCallback(async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask가 설치되어 있지 않습니다.',
      }));
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          account: accounts[0],
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('연결 확인 중 오류:', error);
    }
  }, []);

  // MetaMask 연결
  const connectWallet = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
      setWalletState(prev => ({
        ...prev,
        error: 'MetaMask가 설치되어 있지 않습니다. https://metamask.io/에서 설치해주세요.',
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 먼저 현재 연결된 계정들을 확인
      const currentAccounts = await window.ethereum.request({ method: 'eth_accounts' });
      
      // 이미 연결된 계정이 있으면 새로운 계정 선택을 위해 권한 요청
      if (currentAccounts.length > 0) {
        // 새로운 계정 연결 요청 (계정 선택 팝업 강제 표시)
        try {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
        } catch {
          // 권한 요청이 실패하면 기존 방식으로 연결 시도
          console.log('Permission request failed, trying standard connection');
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletState({
          isConnected: true,
          account: accounts[0],
          isLoading: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      console.error('MetaMask 연결 오류:', error);
      const errorMessage = error instanceof Error ? error.message : 'MetaMask 연결에 실패했습니다.';
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  // 연결 해제
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      account: null,
      isLoading: false,
      error: null,
    });
  };

  // 주소 축약 표시
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 컴포넌트 마운트 시 연결 상태 확인
  useEffect(() => {
    checkConnection();

    // MetaMask 계정 변경 이벤트 리스너
    if (isMetaMaskInstalled() && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWalletState(prev => ({
            ...prev,
            account: accounts[0],
            isConnected: true,
          }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [checkConnection]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isMetaMaskInstalled: isMetaMaskInstalled(),
  };
};

// TypeScript 타입 확장
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
      on: (eventName: string, handler: (args: string[]) => void) => void;
      removeListener: (eventName: string, handler: (args: string[]) => void) => void;
    };
  }
}
