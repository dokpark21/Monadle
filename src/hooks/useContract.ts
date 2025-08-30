"use client";

import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { MELODLE_VAULT_ABI, MELODLE_VAULT_ADDRESS, NETWORK_CONFIG } from '@/constants/contracts';

export interface ContractState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
}

export const useContract = () => {
  const [contractState, setContractState] = useState<ContractState>({
    isLoading: false,
    error: null,
    txHash: null,
  });

  // 멜로디를 32바이트 해시로 변환
  const hashMelody = useCallback(async (melody: string[]): Promise<string> => {
    try {
      const melodyString = melody.join('-');
      const encoder = new TextEncoder();
      const data = encoder.encode(melodyString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      console.log('멜로디 해시 (SHA-256):', '0x' + hex);
      return '0x' + hex;
    } catch (error) {
      console.error('멜로디 해싱 오류:', error);
      throw error;
    }
  }, []);

  // Provider와 Signer 생성
  const getProviderAndSigner = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask가 설치되어 있지 않습니다.');
    }

    // 현재 네트워크 확인
    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
    const currentChainId = parseInt(chainId, 16);
    
    console.log('현재 체인 ID:', currentChainId);
    console.log('예상 체인 ID:', NETWORK_CONFIG.chainId);

    // 네트워크가 다르면 전환 요청
    if (currentChainId !== NETWORK_CONFIG.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + NETWORK_CONFIG.chainId.toString(16) }],
        });
        
        // 네트워크 전환 후 잠시 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (switchError) {
        console.error('네트워크 전환 실패:', switchError);
        throw new Error(`Monad 테스트넷으로 네트워크를 전환해주세요. (체인 ID: ${NETWORK_CONFIG.chainId})`);
      }
    }

    // 네트워크 전환 후 새로운 Provider 생성
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // 네트워크 재확인
    const network = await provider.getNetwork();
    const finalChainId = Number(network.chainId);
    
    if (finalChainId !== NETWORK_CONFIG.chainId) {
      throw new Error(`네트워크 전환이 완료되지 않았습니다. 현재: ${finalChainId}, 예상: ${NETWORK_CONFIG.chainId}`);
    }

    // Signer 생성
    const signer = await provider.getSigner();
    return { provider, signer };
  }, []);

  // 컨트랙트 인스턴스 생성
  const getContract = useCallback(async () => {
    const { signer } = await getProviderAndSigner();
    return new ethers.Contract(MELODLE_VAULT_ADDRESS, MELODLE_VAULT_ABI, signer);
  }, [getProviderAndSigner]);

  // 멜로디 생성 (owner만 가능)
  const createMelody = useCallback(async (melody: string[]) => {
    setContractState({ isLoading: true, error: null, txHash: null });

    try {
      console.log('멜로디 생성 시작:', melody);

      // 멜로디를 32바이트 해시로 변환
      const melodyHash = await hashMelody(melody);
      console.log('멜로디 해시:', melodyHash);
      
      // 컨트랙트 인스턴스 생성
      const contract = await getContract();
      console.log('컨트랙트 주소:', await contract.getAddress());

      // createMelody 함수 호출
      const tx = await contract.createMelody(melodyHash);
      console.log('트랜잭션 전송됨:', tx.hash);

      setContractState({ isLoading: false, error: null, txHash: tx.hash });
      return { txHash: tx.hash, melodyHash };
    } catch (error) {
      console.error('멜로디 생성 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '멜로디 생성 중 오류가 발생했습니다.';
      setContractState({ isLoading: false, error: errorMessage, txHash: null });
      throw error;
    }
  }, [hashMelody, getContract]);

  // 단어 생성 (owner만 가능)
  const createWord = useCallback(async (word: string) => {
    setContractState({ isLoading: true, error: null, txHash: null });

    try {
      console.log('단어 생성 시작:', word);

      // 단어를 32바이트 해시로 변환
      const wordBytes = ethers.toUtf8Bytes(word.toUpperCase());
      const wordHash = ethers.keccak256(wordBytes);
      console.log('단어 해시:', wordHash);
      
      // 컨트랙트 인스턴스 생성
      const contract = await getContract();
      console.log('컨트랙트 주소:', await contract.getAddress());

      // createWord 함수 호출
      const tx = await contract.createWord(wordHash);
      console.log('트랜잭션 전송됨:', tx.hash);

      setContractState({ isLoading: false, error: null, txHash: tx.hash });
      return { txHash: tx.hash, wordHash, word: word.toUpperCase() };
    } catch (error) {
      console.error('단어 생성 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '단어 생성 중 오류가 발생했습니다.';
      setContractState({ isLoading: false, error: errorMessage, txHash: null });
      throw error;
    }
  }, [getContract]);

  // 멜로디 제출
  const submitMelody = useCallback(async (melody: string[], valueInEth: string): Promise<{ txHash: string; isCorrect: boolean }> => {
    setContractState({ isLoading: true, error: null, txHash: null });

    try {
      const contract = await getContract();
      const guessHash = await hashMelody(melody);
      const value = ethers.parseEther(valueInEth);

      console.log('멜로디 제출 시작:', melody);
      console.log('멜로디 해시:', guessHash);
      console.log('제출 금액:', valueInEth, 'ETH');

      // 실제 트랜잭션 전송
      const tx = await contract.submitMelody(guessHash, { value });
      console.log('트랜잭션 전송됨:', tx.hash);

      setContractState({ isLoading: false, error: null, txHash: tx.hash });
      return { 
        txHash: tx.hash, 
        isCorrect: true // 결과는 트랜잭션 완료 후 이벤트로 확인
      };
    } catch (error) {
      console.error('멜로디 제출 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '멜로디 제출 중 오류가 발생했습니다.';
      setContractState({ isLoading: false, error: errorMessage, txHash: null });
      throw error;
    }
  }, [hashMelody, getContract]);

  // 토큰 상환
  const redeemTokens = useCallback(async (amount: string) => {
    setContractState({ isLoading: true, error: null, txHash: null });

    try {
      const contract = await getContract();
      const parsedAmount = ethers.parseUnits(amount, 18);

      const tx = await contract.redeem(parsedAmount);

      setContractState({ isLoading: false, error: null, txHash: tx.hash });
      return tx.hash;
    } catch (error) {
      console.error('토큰 상환 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '토큰 상환 중 오류가 발생했습니다.';
      setContractState({ isLoading: false, error: errorMessage, txHash: null });
      throw error;
    }
  }, [getContract]);

  // 멜로디 보관소 조회
  const getMelodyVault = useCallback(async (): Promise<string> => {
    try {
      const contract = await getContract();
      const vault = await contract.melodyVault();
      return ethers.formatEther(vault);
    } catch (error) {
      console.error('멜로디 보관소 조회 오류:', error);
      return '0';
    }
  }, [getContract]);

  // 총 시도 횟수 조회
  const getTotalAttempts = useCallback(async (): Promise<string> => {
    try {
      const contract = await getContract();
      const attempts = await contract.melodyTotalAttempts();
      return attempts.toString();
    } catch (error) {
      console.error('총 시도 횟수 조회 오류:', error);
      return '0';
    }
  }, [getContract]);

  return {
    contractState,
    createMelody,
    createWord,
    submitMelody,
    redeemTokens,
    getMelodyVault,
    getTotalAttempts,
    getContract,
    hashMelody,
  };
};

// TypeScript 타입 확장
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
