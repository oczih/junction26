'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundEngine } from '@/lib/sound-effects';

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bet: number;
  color: string;
}

interface Peg {
  x: number;
  y: number;
  r: number;
  lastHit: number;
}

interface FloatingWin {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
}

const ROWS = 12;
const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 460;
const PEG_SPACING = 34;
const ROW_SPACING = 32;
const START_Y = 38;
const BALL_RADIUS = 5.5;
const PEG_RADIUS = 3.2;

// 13 Multiplier slots - all >= 1.2x so the player always wins more coins!
const MULTIPLIERS = [
  { val: 33, label: '33x', bg: '#ff003f', text: '#ffffff' },
  { val: 11, label: '11x', bg: '#ff1937', text: '#ffffff' },
  { val: 4, label: '4x', bg: '#ff3b20', text: '#ffffff' },
  { val: 2.5, label: '2.5x', bg: '#ff601f', text: '#ffffff' },
  { val: 1.8, label: '1.8x', bg: '#ff9110', text: '#ffffff' },
  { val: 1.3, label: '1.3x', bg: '#ffa809', text: '#1f2937' },
  { val: 1.2, label: '1.2x', bg: '#ffc000', text: '#1f2937' },
  { val: 1.3, label: '1.3x', bg: '#ffa809', text: '#1f2937' },
  { val: 1.8, label: '1.8x', bg: '#ff9110', text: '#ffffff' },
  { val: 2.5, label: '2.5x', bg: '#ff601f', text: '#ffffff' },
  { val: 4, label: '4x', bg: '#ff3b20', text: '#ffffff' },
  { val: 11, label: '11x', bg: '#ff1937', text: '#ffffff' },
  { val: 33, label: '33x', bg: '#ff003f', text: '#ffffff' },
];

export function PlinkoGame() {
  const [balance, setBalance] = useState<number>(50);
  const [betInput, setBetInput] = useState<string>('5');
  const [isAuto, setIsAuto] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'auto'>('manual');
  const [activeSlotHit, setActiveSlotHit] = useState<number | null>(null);
  const [history, setHistory] = useState<Array<{ id: number; mult: number; label: string; bg: string }>>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const pegsRef = useRef<Peg[]>([]);
  const floatingWinsRef = useRef<FloatingWin[]>([]);
  const nextBallId = useRef<number>(1);
  const nextWinId = useRef<number>(1);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoRef = useRef<boolean>(false);
  const balanceRef = useRef<number>(50);
  const betInputRef = useRef<string>('5');

  // Keep refs in sync for the animation loop
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    betInputRef.current = betInput;
  }, [betInput]);

  useEffect(() => {
    isAutoRef.current = isAuto;
  }, [isAuto]);

  // Initialize peg coordinates once
  useEffect(() => {
    const pegs: Peg[] = [];
    const centerX = CANVAS_WIDTH / 2;

    for (let r = 0; r < ROWS; r++) {
      const pegsInRow = r + 3;
      const y = START_Y + r * ROW_SPACING;
      for (let c = 0; c < pegsInRow; c++) {
        const x = centerX + (c - (pepsOffset(pegsInRow))) * PEG_SPACING;
        pegs.push({ x, y, r: PEG_RADIUS, lastHit: 0 });
      }
    }
    pegsRef.current = pegs;

    function pepsOffset(count: number) {
      return (count - 1) / 2;
    }
  }, []);

  const dropBall = useCallback(() => {
    const currentBet = parseFloat(betInputRef.current);
    if (isNaN(currentBet) || currentBet <= 0) return;
    if (balanceRef.current < currentBet) {
      if (balanceRef.current <= 0) {
        // Auto-replenish if user reaches 0
        setBalance(50);
        balanceRef.current = 50;
      } else {
        // Adjust bet to remaining balance
        setBetInput(balanceRef.current.toString());
        betInputRef.current = balanceRef.current.toString();
      }
      return;
    }

    // Deduct bet from balance
    const newBal = Math.max(0, Number((balanceRef.current - currentBet).toFixed(2)));
    balanceRef.current = newBal;
    setBalance(newBal);

    // Play release sound
    soundEngine.playRelease();

    // Spawn ball
    const centerX = CANVAS_WIDTH / 2;
    const offset = (Math.random() - 0.5) * 6;
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#38bdf8', '#00f0ff'];
    const ballColor = colors[Math.floor(Math.random() * colors.length)];

    ballsRef.current.push({
      id: nextBallId.current++,
      x: centerX + offset,
      y: 12,
      vx: (Math.random() - 0.5) * 0.8,
      vy: 1.2,
      bet: currentBet,
      color: ballColor,
    });
  }, []);

  // Handle Auto mode interval
  useEffect(() => {
    if (isAuto) {
      autoIntervalRef.current = setInterval(() => {
        dropBall();
      }, 350);
    } else {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
        autoIntervalRef.current = null;
      }
    }
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [isAuto, dropBall]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const gravity = 0.22;
    const bounceLoss = 0.58;
    const bottomThreshold = START_Y + (ROWS - 1) * ROW_SPACING + 22;
    const centerX = CANVAS_WIDTH / 2;

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      const now = performance.now();

      // Draw subtle background grid/ambient lines
      ctx.fillStyle = '#0b131e';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Render pegs
      for (let i = 0; i < pegsRef.current.length; i++) {
        const peg = pegsRef.current[i];
        const timeSinceHit = now - peg.lastHit;
        const isGlowing = timeSinceHit < 250;

        ctx.beginPath();
        ctx.arc(peg.x, peg.y, isGlowing ? peg.r * 1.5 : peg.r, 0, Math.PI * 2);

        if (isGlowing) {
          const glowAlpha = Math.max(0, 1 - timeSinceHit / 250);
          ctx.fillStyle = '#60a5fa';
          ctx.shadowColor = '#3b82f6';
          ctx.shadowBlur = 10 * glowAlpha;
        } else {
          ctx.fillStyle = '#94a3b8';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Physics update & render balls
      const remainingBalls: Ball[] = [];

      for (let b = 0; b < ballsRef.current.length; b++) {
        const ball = ballsRef.current[b];

        ball.vy += gravity;
        ball.vx *= 0.995; // gentle air drag
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Peg collision check
        for (let p = 0; p < pegsRef.current.length; p++) {
          const peg = pegsRef.current[p];
          const dx = ball.x - peg.x;
          const dy = ball.y - peg.y;
          const distSq = dx * dx + dy * dy;
          const minDist = BALL_RADIUS + peg.r;

          if (distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq) || 0.001;
            const nx = dx / dist;
            const ny = dy / dist;

            // Push out of collision
            ball.x = peg.x + nx * (minDist + 0.5);
            ball.y = peg.y + ny * (minDist + 0.5);

            // Reflect velocity
            const dot = ball.vx * nx + ball.vy * ny;
            ball.vx = (ball.vx - 1.85 * dot * nx) * bounceLoss + (Math.random() - 0.5) * 0.5;
            ball.vy = Math.max(0.6, (ball.vy - 1.85 * dot * ny) * bounceLoss);

            peg.lastHit = now;
            soundEngine.playPegHit(peg.y / CANVAS_HEIGHT);
          }
        }

        // Clamp inside canvas horizontal bounds
        if (ball.x < 30) {
          ball.x = 30;
          ball.vx = Math.abs(ball.vx) * 0.6;
        } else if (ball.x > CANVAS_WIDTH - 30) {
          ball.x = CANVAS_WIDTH - 30;
          ball.vx = -Math.abs(ball.vx) * 0.6;
        }

        // Check if ball reached bottom bucket
        if (ball.y >= bottomThreshold) {
          // Calculate landing slot
          const slotOffset = (ball.x - centerX) / PEG_SPACING;
          let slotIdx = Math.round(slotOffset + (MULTIPLIERS.length - 1) / 2);
          slotIdx = Math.max(0, Math.min(MULTIPLIERS.length - 1, slotIdx));

          const slot = MULTIPLIERS[slotIdx];
          const winAmount = Number((ball.bet * slot.val).toFixed(2));

          // Award win to balance
          const updatedBal = Number((balanceRef.current + winAmount).toFixed(2));
          balanceRef.current = updatedBal;
          setBalance(updatedBal);

          // Play slot hit chime
          soundEngine.playSlotWin(slot.val);

          // Trigger slot bounce effect
          setActiveSlotHit(slotIdx);
          setTimeout(() => {
            setActiveSlotHit(prev => (prev === slotIdx ? null : prev));
          }, 220);

          // Add to win history
          setHistory(prev => [
            { id: nextWinId.current++, mult: slot.val, label: slot.label, bg: slot.bg },
            ...prev.slice(0, 5),
          ]);

          // Add floating win number
          floatingWinsRef.current.push({
            id: nextWinId.current++,
            x: ball.x,
            y: bottomThreshold - 10,
            text: `+${winAmount}`,
            color: slot.bg,
            opacity: 1,
          });

          // Ball is consumed
          continue;
        }

        // Render ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        remainingBalls.push(ball);
      }
      ballsRef.current = remainingBalls;

      // Render floating wins
      const remainingWins: FloatingWin[] = [];
      for (let w = 0; w < floatingWinsRef.current.length; w++) {
        const fw = floatingWinsRef.current[w];
        fw.y -= 0.8;
        fw.opacity -= 0.02;

        if (fw.opacity > 0) {
          ctx.save();
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = fw.color;
          ctx.globalAlpha = fw.opacity;
          ctx.shadowColor = fw.color;
          ctx.shadowBlur = 6;
          ctx.fillText(fw.text, fw.x, fw.y);
          ctx.restore();
          remainingWins.push(fw);
        }
      }
      floatingWinsRef.current = remainingWins;

      animFrame = requestAnimationFrame(render);
    };

    animFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setBetInput(val);
    }
  };

  const handleHalfBet = () => {
    const num = parseFloat(betInput) || 1;
    const half = Math.max(0.1, Number((num / 2).toFixed(2)));
    setBetInput(half.toString());
  };

  const handleDoubleBet = () => {
    const num = parseFloat(betInput) || 1;
    const doubled = Number((num * 2).toFixed(2));
    setBetInput(doubled.toString());
  };

  const handleMaxBet = () => {
    setBetInput(balance.toString());
  };

  return (
    <div className="z-60 mx-auto h-fit w-full min-w-0">
      <div className="flex flex-col">
        {/* Header requested: "This is a boiler" */}
        <h1 className="text-center font-bold text-2xl md:text-3xl text-slate-200 pt-4 pb-2">
          This is a boiler
        </h1>

        <div className="flex min-h-[calc(100vh-140px)] flex-grow flex-col">
          <div className="flex-grow">
            {/* Main Plinko Container matching user's snippet classes */}
            <div className="mx-auto flex h-auto min-h-[600px] w-[95%] max-w-[1200px] flex-col lg:flex-row rounded-[12px] bg-dark-900 shadow-2xl border border-slate-800/80 transition-all duration-200 mt-2 mb-6 overflow-hidden">
              
              {/* Left Control Panel (380px on desktop) */}
              <div className="flex shrink-0 flex-col gap-5 rounded-[12px] lg:rounded-r-none bg-dark-700 p-6 lg:p-8 w-full lg:w-[360px] border-b lg:border-b-0 lg:border-r border-slate-800/80">
                
                {/* Manual / Auto Tab Switcher */}
                <div
                  role="tablist"
                  className="h-[44px] p-1 bg-dark-600 relative inline-flex gap-1 rounded-lg w-full"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('manual');
                      setIsAuto(false);
                    }}
                    className={`z-20 flex-1 flex cursor-pointer items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'manual'
                        ? 'bg-dark-400 text-light-000 shadow-sm'
                        : 'text-dark-200 hover:text-light-000'
                    }`}
                  >
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('auto');
                      setIsAuto(false);
                    }}
                    className={`z-20 flex-1 flex cursor-pointer items-center justify-center rounded-md text-sm font-semibold transition-all duration-200 ${
                      activeTab === 'auto'
                        ? 'bg-dark-400 text-light-000 shadow-sm'
                        : 'text-dark-200 hover:text-light-000'
                    }`}
                  >
                    Auto
                  </button>
                </div>

                {/* Coin Balance Display */}
                <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-600 border border-slate-700/40">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪙</span>
                    <span className="text-xs font-semibold text-dark-200 uppercase tracking-wider">
                      Coins
                    </span>
                  </div>
                  <span className="text-lg font-bold text-yellow-400 font-mono tracking-tight">
                    {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Bet Input Field */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-dark-200">
                    <span>Bet</span>
                  </div>

                  <div className="group flex items-center bg-dark-600 text-dark-200 rounded-lg px-3 py-1.5 h-[48px] border border-slate-700/50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                    <span className="text-blue-400 font-bold mr-2 text-sm">🪙</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={betInput}
                      onChange={handleBetChange}
                      className="w-full bg-transparent outline-none text-light-000 font-bold text-base placeholder:text-dark-300 font-mono"
                      placeholder="0.00"
                    />

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        type="button"
                        onClick={handleHalfBet}
                        className="bg-dark-400 hover:bg-dark-300 active:scale-95 text-light-000 text-xs font-bold px-2 py-1.5 rounded transition-all"
                      >
                        ½
                      </button>
                      <button
                        type="button"
                        onClick={handleDoubleBet}
                        className="bg-dark-400 hover:bg-dark-300 active:scale-95 text-light-000 text-xs font-bold px-2 py-1.5 rounded transition-all"
                      >
                        2x
                      </button>
                      <button
                        type="button"
                        onClick={handleMaxBet}
                        className="bg-dark-400 hover:bg-dark-300 active:scale-95 text-light-000 text-xs font-bold px-2.5 py-1.5 rounded transition-all uppercase"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bet Action Button */}
                <div className="mt-2">
                  {activeTab === 'manual' ? (
                    <button
                      type="button"
                      onClick={dropBall}
                      className="w-full h-[48px] bg-blue-600 hover:bg-blue-500 active:bg-blue-700 active:scale-[0.99] text-white font-bold text-base rounded-lg transition-all duration-150 shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
                    >
                      Place Bet
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAuto(!isAuto)}
                      className={`w-full h-[48px] font-bold text-base rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer shadow-lg ${
                        isAuto
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                      }`}
                    >
                      {isAuto ? 'Stop Autobet' : 'Start Autobet'}
                    </button>
                  )}
                </div>

              </div>

              {/* Right Game Canvas & Multipliers Stage */}
              <div className="relative grow flex flex-col items-center justify-between p-4 lg:p-6 overflow-hidden bg-dark-900">
                
                {/* Header Controls: Sound toggle & Recent Multipliers */}
                <div className="flex w-full items-center justify-between min-h-[30px] mb-2 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      const next = soundEngine.toggleMute();
                      setIsMuted(next);
                    }}
                    aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
                    className="flex items-center justify-center p-1.5 rounded-md text-dark-200 hover:text-light-000 hover:bg-dark-600 transition-colors cursor-pointer"
                  >
                    {isMuted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {history.map(item => (
                      <span
                        key={item.id}
                        style={{ backgroundColor: item.bg }}
                        className="text-[11px] font-extrabold px-2 py-0.5 rounded text-white shadow-sm transition-all animate-in fade-in zoom-in-95 duration-200"
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex h-full w-full max-w-[640px] items-center justify-center overflow-hidden">
                  <div className="relative flex flex-col items-center justify-center w-full">
                    <canvas
                      ref={canvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      className="max-h-[75vh] max-w-full rounded-lg shadow-inner"
                      style={{ width: '100%', height: 'auto', aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
                    />

                    {/* Plinko Slots Row at the bottom */}
                    <div
                      className="flex w-full justify-center gap-1 mt-1 px-1"
                      style={{ maxWidth: '640px' }}
                    >
                      {MULTIPLIERS.map((slot, index) => {
                        const isHit = activeSlotHit === index;
                        return (
                          <div
                            key={index}
                            style={{
                              backgroundColor: slot.bg,
                              color: slot.text,
                              transform: isHit ? 'translateY(5px) scale(1.08)' : 'translateY(0)',
                              boxShadow: isHit ? `0 0 15px ${slot.bg}` : 'none',
                            }}
                            className="flex-1 flex flex-col items-center justify-center py-1.5 sm:py-2 rounded-md font-black text-[10px] sm:text-xs transition-transform duration-150 select-none cursor-default"
                          >
                            <span className="leading-none">{slot.label}</span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                <div className="w-full h-2" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

