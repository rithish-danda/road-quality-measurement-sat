import React from 'react';

export default function Info() {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-3xl mx-auto prose prose-invert flex flex-col items-center space-y-10">
          <div className="text-center w-full">
            <h2 className="text-3xl font-semibold mb-6">Our Team</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-left">
                <h3 className="text-2xl mb-3">Team Members</h3>
                <ul className="list-disc pl-5">
                  <li className="mb-2">Pavithra Bhupal (Lead)</li>
                  <li className="mb-2">Danda Sai Rithish</li>
                  <li className="mb-2">Datla Lakshmi Narayana Varma</li>
                  <li className="mb-2">Nikith Kumar</li>
                </ul>
              </div>
              <div className="flex flex-col items-center text-left">
                <h3 className="text-2xl mb-3">Project Guide</h3>
                <ul className="list-disc pl-5">
                  <li>Dr. Sandhya V</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center w-full">
            <h2 className="text-3xl font-semibold mb-6">Technology</h2>
            <p className="mb-4 text-left">
              Our road quality analysis system uses machine learning
              algorithms such as DeeplabV3+ and ResNet-50 to process satellite imagery and detect road conditions. The
              system can identify:
            </p>
            <ul className="list-disc pl-5 text-left">
              <li className="mb-2">Surface cracks and potholes</li>
              <li className="mb-2">Road deterioration patterns</li>
              <li className="mb-2">Traffic impact assessment (Future Goals)</li>
              <li className="mb-2">Improved Damage Detection (Future Goals)</li>
            </ul>
          </div>

          <div className="text-center w-full">
            <h2 className="text-3xl font-semibold mb-6">Publications</h2>
            <ul className="list-disc pl-5">
              <li>
                "Machine Learning Approaches for Satellite-Based Road Quality Assessment"
                - IEEE, 2025 (Submitting soon..)
              </li>
            </ul>
          </div>

          <button 
            onClick={() => window.open('https://docs.google.com/document/d/1cwzrbophiUcsjWFSVqMOOB1oHNgCjGAlEZvFmmrRnBk/edit?usp=share_link', '_blank')}
            className="bg-blue-600 text-white text-xl font-semibold px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg mt-5"
          >
            Documentation
          </button>
        </div>
      </div>
    </div>
  );
}