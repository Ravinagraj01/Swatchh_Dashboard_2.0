import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white shadow-lg rounded-2xl p-6">{children}</div>
);

export const CardHeader = ({ title }) => (
  <div className="mb-4">
    <h2 className="text-xl font-bold">{title}</h2>
  </div>
);

export const CardContent = ({ children }) => (
  <div>
    {children}
  </div>
);
