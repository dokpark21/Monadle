"use client";

import React from "react";
import { PianoKey, MelodyGrid } from "@/components/styled/GameStyles";
import { NOTES, KEYBOARD_MAPPING } from "@/constants/gameData";
import { NoteData } from "@/types/game";

interface PianoKeyboardProps {
  onNoteSelect: (note: string) => void;
  isGameOver: boolean;
}

const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  onNoteSelect,
  isGameOver,
}) => {
  return (
    <MelodyGrid>
      {NOTES.map((noteObj: NoteData) => {
        const keyLabel = KEYBOARD_MAPPING[noteObj.display];

        return (
          <PianoKey
            key={noteObj.display}
            onClick={() => onNoteSelect(noteObj.display)}
            disabled={isGameOver}
            isBlack={noteObj.isBlack}
          >
            <div
              style={{ fontSize: "0.8rem", opacity: 0.7, marginBottom: "5px" }}
            >
              {keyLabel}
            </div>
            <div
              style={{
                fontSize: noteObj.isBlack ? "1rem" : "1.2rem",
                fontWeight: "700",
              }}
            >
              {noteObj.display}
            </div>
          </PianoKey>
        );
      })}
    </MelodyGrid>
  );
};

export default PianoKeyboard;
