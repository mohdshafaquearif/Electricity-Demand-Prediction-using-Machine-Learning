// components/SystemDiagram.tsx
import React from 'react';
import Image from 'next/image';

interface SystemDiagramProps {
  anomalies: string[];
}

const SystemDiagram: React.FC<SystemDiagramProps> = ({ anomalies }) => {
  // Helper function to check if pipe has anomaly
  const isPipeAnomalous = (pipeNumber: string) => {
    return anomalies.some(anomaly => 
      anomaly.toLowerCase().includes(`pipe ${pipeNumber}`) || 
      anomaly.toLowerCase().includes(`p${pipeNumber}`)
    );
  };

  // Pipe label positions based on the image
  const pipePositions = {
    '1': { top: '30%', left: '22%' },
    '2': { top: '30%', left: '42%' },
    '3': { top: '30%', left: '62%' },
    '4': { top: '70%', left: '62%' },
    '5': { top: '50%', left: '32%' },
    '6': { top: '75%', left: '22%' }
  };

  return (
    <div className="relative w-full h-[800px]">
      {/* Base System Image */}
      <div className="absolute inset-0">
        <Image
          src="/system-diagram.png"
          alt="System Diagram"
          layout="fill"
          objectFit="contain"
          priority
        />
      </div>

      {/* Pipe Label Highlights */}
      {Object.entries(pipePositions).map(([pipeNumber, position]) => (
        isPipeAnomalous(pipeNumber) && (
          <div
            key={pipeNumber}
            className="absolute z-20"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {/* Pulsing Highlight Effect */}
            <div className="relative group">
              {/* Background Pulse */}
              <div className="absolute -inset-2 bg-red-500 rounded-lg opacity-75 animate-pulse"></div>
              
              {/* Pipe Label */}
              <div className="relative px-3 py-1 bg-red-600 text-white rounded-lg font-bold shadow-lg">
                PIPE {pipeNumber}
              </div>

              {/* Tooltip */}
              <div className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap">
                Anomaly Detected in Pipe {pipeNumber}!
              </div>

              {/* Connecting Line */}
              <div className="absolute h-8 w-0.5 bg-red-500 -bottom-8 left-1/2 transform -translate-x-1/2"></div>
            </div>
          </div>
        )
      ))}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg">
        <h4 className="text-sm font-semibold mb-2">Anomaly Detection</h4>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 animate-pulse rounded mr-2"></div>
          <span className="text-sm">Anomaly Detected</span>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagram;