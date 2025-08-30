"use client";

import React from "react";
import styled from "styled-components";
import {
  potFill,
  potGlow,
  coinDrop,
  tokenBounce,
} from "@/components/styled/GameStyles";

const PotContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
`;

const Pot = styled.div.withConfig({
  shouldForwardProp: (prop) => !['fillLevel', 'isGlowing'].includes(prop),
})<{ fillLevel: number; isGlowing: boolean }>`
  width: 160px;
  height: 140px;
  background: linear-gradient(135deg, #8b4513, #a0522d);
  border-radius: 80px 80px 30px 30px;
  position: relative;
  border: 3px solid #654321;
  box-shadow: ${(props) =>
    props.isGlowing
      ? "0 0 50px rgba(168, 85, 247, 0.8)"
      : "0 10px 30px rgba(0, 0, 0, 0.4)"};
  animation: ${(props) => (props.isGlowing ? potGlow : "none")} 2s ease-in-out
    infinite;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 30px;
    background: linear-gradient(135deg, #8b4513, #a0522d);
    border-radius: 60px 60px 0 0;
    border: 3px solid #654321;
    border-bottom: none;
  }
`;

const PotFill = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'fillLevel',
})<{ fillLevel: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${(props) => Math.min(props.fillLevel * 100, 80)}%;
  background: linear-gradient(135deg, #ffd700, #ffa500);
  border-radius: 0 0 27px 27px;
  transition: height 0.5s ease;
  animation: ${potFill} 0.5s ease-out;
`;

const TokenIcon = styled.div`
  position: absolute;
  font-size: 2rem;
  color: #ffd700;
  animation: ${tokenBounce} 1s ease-in-out infinite;
`;

const CoinDrop = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'delay',
})<{ delay: number }>`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.8rem;
  color: #ffd700;
  animation: ${coinDrop} 1s ease-in-out ${(props) => props.delay}s;
  pointer-events: none;
`;

const PotInfo = styled.div`
  text-align: center;
  margin-top: 25px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  h3 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 15px;
  }

  p {
    color: white;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 8px 0;
  }

  .description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 15px;
  }
`;

interface PotDisplayProps {
  potTokens: number;
  isAddingToPot: boolean;
  showCoinDrops: boolean;
}

const PotDisplay: React.FC<PotDisplayProps> = ({
  potTokens,
  isAddingToPot,
  showCoinDrops,
}) => {
  const potFillLevel = Math.min(potTokens / 10000, 1);

  return (
    <PotContainer>
      <Pot fillLevel={potFillLevel} isGlowing={isAddingToPot}>
        <PotFill fillLevel={potFillLevel} />
        <TokenIcon>🪙</TokenIcon>
        {showCoinDrops && (
          <>
            <CoinDrop delay={0}>🪙</CoinDrop>
            <CoinDrop delay={0.2}>🪙</CoinDrop>
            <CoinDrop delay={0.4}>🪙</CoinDrop>
          </>
        )}
      </Pot>
      <PotInfo>
        <h3>Pot Tokens</h3>
        <p style={{ color: "#10b981" }}>{potTokens.toLocaleString()}</p>
        <p className="description">Accumulated from all players&apos; attempts</p>
      </PotInfo>
    </PotContainer>
  );
};

export default PotDisplay;
