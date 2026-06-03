'use client';

import { useEffect, useRef } from 'react';

export function BrainVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 80;

    let angle = 0;

    const drawBrain = () => {
      ctx.clearRect(0, 0, width, height);

      // Brain outline with glow
      ctx.fillStyle = 'rgba(0, 255, 136, 0.1)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius + 10, radius + 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw brain structure
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius - 15, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating neural network visualization
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.6)';
      ctx.lineWidth = 1.5;

      const nodeCount = 12;
      for (let i = 0; i < nodeCount; i++) {
        const nodeAngle = (angle + (i * Math.PI * 2) / nodeCount) % (Math.PI * 2);
        const x = centerX + Math.cos(nodeAngle) * radius * 0.7;
        const y = centerY + Math.sin(nodeAngle) * radius * 0.6;

        // Draw connections
        for (let j = i + 1; j < nodeCount; j++) {
          const targetAngle = (angle + (j * Math.PI * 2) / nodeCount) % (Math.PI * 2);
          const targetX = centerX + Math.cos(targetAngle) * radius * 0.7;
          const targetY = centerY + Math.sin(targetAngle) * radius * 0.6;

          if (Math.abs(i - j) <= 2 || Math.abs(i - j) === nodeCount - 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
          }
        }

        // Draw nodes
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
        gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 255, 136, 0.2)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 15);
      coreGradient.addColorStop(0, 'rgba(99, 102, 255, 0.6)');
      coreGradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.3)');
      coreGradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
      ctx.fill();

      angle += 0.01;
      requestAnimationFrame(drawBrain);
    };

    canvas.width = 300;
    canvas.height = 300;

    drawBrain();

    return () => {};
  }, []);

  return (
    <div className="flex justify-center items-center h-full">
      <canvas
        ref={canvasRef}
        className="drop-shadow-2xl"
      />
    </div>
  );
}
