import React from 'react';
import { Link } from 'react-router-dom';

export default function LearnMore() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-[6%] py-12">
        <h1 className="text-4xl font-bold mb-12">Road Quality Measurement using Satellite images</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Technology Overview</h2>
              <p className="text-gray-300">
                Our system leverages cutting-edge satellite imagery and machine learning
                to revolutionize road infrastructure monitoring. Using high-resolution
                imagery from multiple satellite providers, we can analyze road conditions
                across vast geographic areas with unprecedented efficiency.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Effortless road condition monitoring</li>
                <li>ML-powered defect detection</li>
                <li>Predictive maintenance forecasting</li>
                <li>Historical condition tracking</li>
                <li>Integrated with International Roughness Index</li>
                <li>Leverages Algorithms like DeepLabV3+ and ResNet-50</li>
              </ul>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Cost Reduction</h3>
                  <p className="text-gray-300">
                    Reduce inspection costs by up to 60% through automated satellite monitoring
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Early Detection</h3>
                  <p className="text-gray-300">
                    Identify potential issues before they become major problems
                  </p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">Coverage</h3>
                  <p className="text-gray-300">
                    Monitor entire road networks simultaneously with satellite technology
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-12 bg-blue-600 p-8 rounded-lg flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">Try the model now!</h2>
          <p className="text-lg mb-6">
            Try the Model now and see the results for yourself!
          </p>
          <Link
            to="/demo"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </div>
  );
}