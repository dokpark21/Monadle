import styled, { keyframes } from "styled-components";

// 애니메이션 정의
export const coinDrop = keyframes`
  0% {
    transform: translateY(-20px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(10px) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: translateY(40px) rotate(360deg);
    opacity: 0;
  }
`;

export const potFill = keyframes`
  0% {
    transform: scaleY(0);
  }
  100% {
    transform: scaleY(1);
  }
`;

export const potGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(147, 51, 234, 0.8);
  }
`;

export const tokenBounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

export const glassFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// 스타일 컴포넌트
export const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0d111c 0%, #1a1f2e 50%, #2d3748 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
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

export const GameContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  max-width: 1000px;
  width: 100%;
  margin-top: 20px;
  position: relative;
  z-index: 1;
`;

export const Title = styled.h1`
  color: white;
  text-align: center;
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 40px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(56, 189, 248, 0.3);
  letter-spacing: 3px;
  position: relative;
  z-index: 2;
  background: linear-gradient(135deg, #60a5fa, #a855f7, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

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

export const MelodyGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin: 40px 0;
  position: relative;
  height: 220px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
`;

export const PianoKey = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isBlack', 'isSelected', 'isCorrect', 'isWrong'].includes(prop),
})<{
  isBlack: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
}>`
  position: relative;
  width: ${(props) => (props.isBlack ? "45px" : "70px")};
  height: ${(props) => (props.isBlack ? "140px" : "220px")};
  border: none;
  border-radius: ${(props) =>
    props.isBlack ? "0 0 10px 10px" : "0 0 16px 16px"};
  background: ${(props) => {
    if (props.isBlack) {
      if (props.isSelected) return "linear-gradient(135deg, #a855f7, #7c3aed)";
      if (props.isCorrect) return "linear-gradient(135deg, #34d399, #10b981)";
      if (props.isWrong) return "linear-gradient(135deg, #ef4444, #dc2626)";
      return "linear-gradient(135deg, #1f2937, #374151)";
    } else {
      if (props.isSelected) return "linear-gradient(135deg, #a855f7, #7c3aed)";
      if (props.isCorrect) return "linear-gradient(135deg, #34d399, #10b981)";
      if (props.isWrong) return "linear-gradient(135deg, #ef4444, #dc2626)";
      return "linear-gradient(135deg, #ffffff, #f8fafc)";
    }
  }};
  color: ${(props) => (props.isBlack ? "white" : "#1e293b")};
  font-weight: 700;
  font-size: ${(props) => (props.isBlack ? "1rem" : "1.2rem")};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.isBlack
      ? "0 6px 12px rgba(0, 0, 0, 0.4)"
      : "0 4px 8px rgba(0, 0, 0, 0.15)"};
  margin: ${(props) => (props.isBlack ? "0 -22px 0 -22px" : "0 3px")};
  z-index: ${(props) => (props.isBlack ? "2" : "1")};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: ${(props) => (props.isBlack ? "translateY(-100px)" : "none")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;

  &:hover {
    transform: ${(props) =>
      props.isBlack ? "translateY(-102px)" : "translateY(-5px)"};
    box-shadow: ${(props) =>
      props.isBlack
        ? "0 8px 16px rgba(0, 0, 0, 0.5)"
        : "0 6px 12px rgba(0, 0, 0, 0.25)"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: ${(props) => (props.isBlack ? "translateY(-100px)" : "none")};
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.isBlack
        ? "linear-gradient(135deg, rgba(255,255,255,0.15), transparent)"
        : "linear-gradient(135deg, rgba(0,0,0,0.08), transparent)"};
    border-radius: inherit;
    pointer-events: none;
  }
`;

export const ControlButton = styled.button`
  background: linear-gradient(135deg, #a855f7, #7c3aed);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin: 15px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const PlayButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isPlaying',
})<{ isPlaying: boolean }>`
  background: ${(props) =>
    props.isPlaying
      ? "linear-gradient(135deg, #ef4444, #dc2626)"
      : "linear-gradient(135deg, #34d399, #10b981)"};
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  margin: 15px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(52, 211, 153, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(52, 211, 153, 0.4);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const InfoPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin: 40px 0;
`;

export const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }

  h3 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 20px;
  }

  p {
    color: white;
    font-size: 2.2rem;
    font-weight: 700;
    margin: 0;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 7px;
  margin: 20px 0;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(45deg, #34d399, #10b981);
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 7px;
`;

export const FeedbackMessage = styled.div<{
  type: "success" | "error" | "info";
}>`
  background: ${(props) => {
    switch (props.type) {
      case "success":
        return "rgba(52, 211, 153, 0.9)";
      case "error":
        return "rgba(239, 68, 68, 0.9)";
      case "info":
        return "rgba(59, 130, 246, 0.9)";
      default:
        return "rgba(0, 0, 0, 0.8)";
    }
  }};
  color: white;
  padding: 25px;
  border-radius: 16px;
  margin: 25px 0;
  text-align: center;
  font-weight: 600;
  font-size: 1.3rem;
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;
