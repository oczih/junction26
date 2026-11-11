'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SaaSPage() {

  return (
    <main className="flex-1 overflow-hidden">

      <h1 className='pt-10 text-center justify-center items-center text-4xl'>
        This is a boiler
      </h1>
    </main>
  );
}
