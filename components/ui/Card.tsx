import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  headerActions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, headerActions }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-navy">{title}</h3>
          {headerActions && <div className="space-x-2">{headerActions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
