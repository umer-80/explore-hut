import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-48 w-full rounded-t-xl" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex justify-between items-center mt-4">
          <div className="skeleton h-8 w-24 rounded-full" />
          <div className="skeleton h-4 w-20 rounded" />
        </div>
      </div>
    </div>
  );
};

export const ListingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailsSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Image skeleton */}
      <div className="skeleton h-96 w-full rounded-2xl" />
      
      {/* Title and info */}
      <div className="space-y-4">
        <div className="skeleton h-10 w-3/4 rounded" />
        <div className="skeleton h-6 w-1/2 rounded" />
        <div className="skeleton h-8 w-32 rounded-full" />
      </div>
      
      {/* Description */}
      <div className="space-y-3">
        <div className="skeleton h-6 w-40 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      
      {/* Reviews */}
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 space-y-2">
            <div className="skeleton h-5 w-32 rounded" />
            <div className="skeleton h-4 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormSkeleton = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card p-8 space-y-6">
        <div className="skeleton h-10 w-64 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-5 w-24 rounded" />
            <div className="skeleton h-12 w-full rounded-lg" />
          </div>
        ))}
        <div className="skeleton h-12 w-full rounded-lg" />
      </div>
    </div>
  );
};
