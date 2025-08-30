"use client";

import React from "react";
import styled from "styled-components";
import { Note } from "@/types/game";

const MelodyDisplayContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 35px;
  border-radius: 20px;
  margin: 40px 0;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  h3 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 25px;
  }
`;

const MelodyNote = styled.span<{
  isCorrect?: boolean;
  isWrong?: boolean;
  isPlaying?: boolean;
}>`
  display: inline-block;
  width: 60px;
  height: 60px;
  line-height: 60px;
  margin: 10px;
  border-radius: 50%;
  background: ${(props) => {
    if (props.isPlaying) return "linear-gradient(135deg, #f97316, #ea580c)";
    if (props.isCorrect) return "linear-gradient(135deg, #34d399, #10b981)";
    if (props.isWrong) return "linear-gradient(135deg, #ef4444, #dc2626)";
    return "rgba(255, 255, 255, 0.15)";
  }};
  color: white;
  font-weight: bold;
  font-size: 1.4rem;
  transition: all 0.3s ease;
  animation: ${(props) =>
    props.isPlaying ? "pulse 0.5s ease-in-out" : "none"};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const MelodyInfo = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  margin: 30px 0;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  h4 {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 15px;
  }

  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.1rem;
    margin: 0;
  }
`;

interface MelodyDisplayProps {
  userMelody: Note[];
  currentMelody: Note[];
  playingIndex: number;
}

const MelodyDisplay: React.FC<MelodyDisplayProps> = ({
  userMelody,
  currentMelody,
  playingIndex,
}) => {
  return (
    <>
      <MelodyDisplayContainer>
        <h3>Today's Melody Length: {currentMelody.length} Notes</h3>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {userMelody.map((note, index) => (
            <MelodyNote key={index} isPlaying={playingIndex === index}>
              {note.note}
            </MelodyNote>
          ))}
          {Array.from({
            length: currentMelody.length - userMelody.length,
          }).map((_, index) => (
            <MelodyNote key={`empty-${index}`}>?</MelodyNote>
          ))}
        </div>
      </MelodyDisplayContainer>

      <MelodyInfo>
        <h4>My Melody: {userMelody.map((n) => n.note).join(" - ")}</h4>
        <p>Click notes or use keyboard to create your melody!</p>
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <strong>Keyboard Controls:</strong>
          <br />
          • Numbers 1-9, 0: Play notes (C, C#, D, D#, E, F, F#, G, G#, A)
          <br />
          • - and =: Play A# and B<br />
          • Backspace: Remove last note
          <br />
          • Enter: Check answer
          <br />• Spacebar: Play your melody
        </div>
      </MelodyInfo>
    </>
  );
};

export default MelodyDisplay;
