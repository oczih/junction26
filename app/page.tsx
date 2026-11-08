/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Page({}) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);


  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-700">Loading the app...</span>
        </div>
      </div>
    );
  }


    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
          Moi
      </div>
    );

}