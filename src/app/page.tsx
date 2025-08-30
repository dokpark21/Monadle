"use client";

import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

// 애니메이션 정의
const tokenBounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const glowPulse = keyframes`
  0%, 100        <ButtonContainer>
          <Link href="/gamePlay">
            <GameButton>
              🎵 Melodle Game
            </GameButton>
          </Link>
          <Link href="/wordPlay">
            <GameButton style={{
              background: 'linear-gradient(135deg, #10b981, #059669)'
            }}>
              🔤 Wordle Game
            </GameButton>
          </Link>
        </ButtonContainer>
        <SubText>
          Monad 블록체인에서 음악과 언어 실력을 동시에 시험해보세요!
        </SubText>w: 0 0 20px rgba(147, 51, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.8);
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// 스타일 컴포넌트
const LandingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0d111c 0%, #1a1f2e 50%, #2d3748 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", "Poppins", "Arial", sans-serif;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(56, 189, 248, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(168, 85, 247, 0.1) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 40%,
        rgba(34, 197, 94, 0.05) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const ContentContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const MainTitle = styled.h1`
  color: white;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(56, 189, 248, 0.3);
  letter-spacing: 3px;
  background: linear-gradient(135deg, #60a5fa, #a855f7, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;

  &::before {
    content: "🎵";
    position: absolute;
    left: -80px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    animation: ${tokenBounce} 2s ease-in-out infinite;
  }

  &::after {
    content: "🎵";
    position: absolute;
    right: -80px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2.5rem;
    animation: ${tokenBounce} 2s ease-in-out infinite 1s;
  }
`;

const Subtitle = styled.h2`
  color: #7dd3fc;
  font-size: 1.5rem;
  margin-bottom: 40px;
  font-weight: 300;
  letter-spacing: 1px;
`;

const InfoContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const InfoTitle = styled.h3`
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
  text-align: left;
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 12px;
`;

const FeatureTitle = styled.h4`
  color: #7dd3fc;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.p`
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const GameButton = styled.button`
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  font-weight: 700;
  padding: 16px 48px;
  border-radius: 50px;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(236, 72, 153, 0.6);
    animation: ${glowPulse} 1s ease-in-out infinite;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const SubText = styled.p`
  color: #7dd3fc;
  font-size: 0.9rem;
  margin-top: 8px;
  opacity: 0.8;
`;

export default function Home() {
  return (
    <LandingContainer>
      <ContentContainer>
        <div style={{ marginBottom: '48px' }}>
          <MainTitle>Monadle</MainTitle>
          <Subtitle>Monad 블록체인에서 즐기는 멜로디 & 단어 게임!</Subtitle>
        </div>

        <InfoContainer>
          <InfoTitle>두 가지 재미있는 게임</InfoTitle>
          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon>�</FeatureIcon>
              <FeatureTitle>Melodle Game</FeatureTitle>
              <FeatureDescription>
                멜로디를 듣고 피아노로 연주해보세요. 정확한 음정과 타이밍으로 도전!
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>🔤</FeatureIcon>
              <FeatureTitle>Wordle Game</FeatureTitle>
              <FeatureDescription>
                5글자 영어 단어를 6번의 기회로 맞춰보세요. 색깔 힌트로 추리해보세요!
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>�</FeatureIcon>
              <FeatureTitle>블록체인 연동</FeatureTitle>
              <FeatureDescription>
                Monad 네트워크에서 게임 결과를 기록하고 토큰을 획득하세요.
              </FeatureDescription>
            </FeatureCard>
            <FeatureCard>
              <FeatureIcon>�</FeatureIcon>
              <FeatureTitle>Web3 게임</FeatureTitle>
              <FeatureDescription>
                MetaMask로 간편하게 연결하고 탈중앙화된 게임을 즐겨보세요.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </InfoContainer>

        <ButtonContainer>
          <Link href="/gamePlay">
            <GameButton>
              � Melodle Game
            </GameButton>
          </Link>
          <Link href="/wordPlay">
            <GameButton style={{
              background: 'linear-gradient(135deg, #10b981, #059669)'
            }}>
              🔤 Wordle Game
            </GameButton>
          </Link>
        </ButtonContainer>
        <SubText>
          음악적 직감과 언어 실력을 동시에 시험해보세요!
        </SubText>
      </ContentContainer>
    </LandingContainer>
  );
}
