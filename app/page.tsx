'use client';

import React from 'react';
import { PlinkoGame } from '@/components/plinko/plinko-game';

export default function HomePage() {
  return (
    <main className="flex-1 overflow-x-hidden">
      <PlinkoGame />
    </main>
  );
}
