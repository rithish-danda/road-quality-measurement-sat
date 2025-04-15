import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from '../components/Globe';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <div className="w-1/2 pr-8 pt-16 z-10 ml-[2%]">
          <h1 className="text-6xl font-bold mb-6">
            Road Condition Measurement using Satellite Images
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Advanced ML-powered analysis for infrastructure monitoring and maintenance
          </p>
          <Link
            to="/learn-more"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Learn More
          </Link>
        </div>
        <div className="absolute -right-[1%] w-3/5 h-screen">
          <Canvas camera={{ position: [0, 0, 3.8], fov: 35 }}>
            <Suspense fallback={null}>
              <Globe />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}