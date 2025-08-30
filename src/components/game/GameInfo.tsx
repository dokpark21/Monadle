"use client";

import React from "react";
import {
  InfoPanel,
  InfoCard,
  ProgressBar,
  ProgressFill,
} from "@/components/styled/GameStyles";

interface GameInfoProps {
  tokens: number;
  attempts: number;
  maxAttempts: number;
}

const GameInfo: React.FC<GameInfoProps> = ({
  tokens,
  attempts,
  maxAttempts,
}) => {
  const progress = (attempts / maxAttempts) * 100;

  return (
    <InfoPanel>
      <InfoCard>
        <h3>My Tokens</h3>
        <p style={{ color: "#fbbf24" }}>{tokens.toLocaleString()}</p>
      </InfoCard>
      <InfoCard>
        <h3>Attempts</h3>
        <p style={{ color: "#8b5cf6" }}>
          {attempts} / {maxAttempts}
        </p>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </InfoCard>
    </InfoPanel>
  );
};

export default GameInfo;
