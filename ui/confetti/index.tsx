"use client";

import React from "react";
import Confetti from "react-confetti";

export default function ConfettiComponent() {
  return <Confetti recycle={false} numberOfPieces={200} />;
}
