'use client'

import React from 'react'

export function GradientMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient mesh background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="grad1" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad2" cx="70%" cy="70%" r="60%">
            <stop offset="0%" stopColor="#F0FDF4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F0FDF4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="grad3" cx="50%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FEF9C3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Animated gradient circles */}
        <circle
          cx="200"
          cy="150"
          r="300"
          fill="url(#grad1)"
          className="animate-mesh-drift"
        />
        <circle
          cx="900"
          cy="450"
          r="350"
          fill="url(#grad2)"
          style={{ animationDelay: '-8s' }}
          className="animate-mesh-drift"
        />
        <circle
          cx="600"
          cy="100"
          r="250"
          fill="url(#grad3)"
          style={{ animationDelay: '-16s' }}
          className="animate-mesh-drift"
        />
      </svg>

      {/* Subtle grid pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0D0D0D" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  )
}
