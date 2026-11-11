'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Container } from './container';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

export interface HeaderProps {
  brandName?: string;
}

export function Header({ brandName = 'Apex' }: HeaderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');



  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-subtle bg-canvas/85 backdrop-blur-md">
        <Container>
          <div className="flex h-16 items-center justify-between">
            {/* Brand Logo & Name */}
            <Link
              href="/"
              className="flex items-center gap-2.5 text-text-primary hover:opacity-90 transition-opacity"
            >
              <div className="h-8 w-8 rounded-lg bg-ember flex items-center justify-center text-canvas font-bold text-sm shadow-[0_0_16px_rgba(242,97,63,0.3)]">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span className="font-semibold text-base tracking-tight text-text-primary">
                {brandName}
              </span>
            </Link>


          </div>
        </Container>
      </header>
    </>
  );
}
