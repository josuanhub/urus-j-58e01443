import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass =
    'bg-gradient-to-r from-[#1A1A2E] via-[#16213E] to-[#1A1A2E] animate-pulse rounded';

  const TableSkeleton = () => (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#0A0A0F]">
      {/* Table Header */}
      <div className="border-b border-white/5 bg-[#1A1A2E]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`h-4 ${baseSkeletonClass} ${
                colIdx === 0 ? 'w-1/4' : colIdx === cols - 1 ? 'w-1/6' : 'flex-1'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="flex items-center gap-3 px-4 py-4 transition-colors hover:bg-white/[0.02]"
          >
            {/* Avatar/Icon column */}
            <div className="flex items-center gap-3 w-1/4">
              <div className={`h-8 w-8 rounded-full flex-shrink-0 ${baseSkeletonClass}`} />
              <div className={`h-4 flex-1 ${baseSkeletonClass}`} />
            </div>

            {/* Middle columns */}
            {Array.from({ length: cols - 2 }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="flex-1"
              >
                <div
                  className={`h-4 ${baseSkeletonClass}`}
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              </div>
            ))}

            {/* Last column - badge/action */}
            <div className="w-1/6 flex justify-end">
              <div className={`h-6 w-16 rounded-full ${baseSkeletonClass}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="border-t border-white/5 bg-[#1A1A2E]/20 px-4 py-3 flex items-center justify-between">
        <div className={`h-4 w-32 ${baseSkeletonClass}`} />
        <div className="flex items-center gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`h-8 w-8 rounded-lg ${baseSkeletonClass}`} />
          ))}
        </div>
      </div>
    </div>
  );

  const CardsSkeleton = () => (
    <div
      className={`grid gap-4 ${
        cols === 1
          ? 'grid-cols-1'
          : cols === 2
          ? 'grid-cols-1 sm:grid-cols-2'
          : cols === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : cols === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
      }`}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="rounded-xl border border-white/5 bg-[#1A1A2E]/60 p-5 space-y-4 overflow-hidden relative"
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`h-11 w-11 rounded-xl flex-shrink-0 ${baseSkeletonClass}`}
                style={{
                  background: `linear-gradient(135deg, #6C63FF22, #00D4AA22)`,
                }}
              />
              <div className="space-y-2">
                <div className={`h-4 w-28 ${baseSkeletonClass}`} />
                <div className={`h-3 w-20 ${baseSkeletonClass}`} />
              </div>
            </div>
            <div className={`h-5 w-12 rounded-full ${baseSkeletonClass}`} />
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Card Stats */}
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, statIdx) => (
              <div key={statIdx} className="space-y-1.5">
                <div className={`h-3 w-16 ${baseSkeletonClass}`} />
                <div className={`h-5 w-12 ${baseSkeletonClass}`} />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <div className={`h-3 w-16 ${baseSkeletonClass}`} />
              <div className={`h-3 w-8 ${baseSkeletonClass}`} />
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${baseSkeletonClass}`}
                style={{ width: `${30 + (rowIdx * 15) % 60}%` }}
              />
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, aIdx) => (
                <div
                  key={aIdx}
                  className={`h-7 w-7 rounded-full border-2 border-[#0A0A0F] ${baseSkeletonClass}`}
                />
              ))}
            </div>
            <div className={`h-8 w-20 rounded-lg ${baseSkeletonClass}`} />
          </div>
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="w-full space-y-2">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#1A1A2E]/60 p-4 hover:bg-white/[0.02] transition-colors"
        >
          {/* Left Icon/Number */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div
              className={`h-10 w-10 rounded-lg ${baseSkeletonClass}`}
              style={{
                background: rowIdx % 3 === 0
                  ? 'linear-gradient(135deg, #6C63FF33, #6C63FF11)'
                  : rowIdx % 3 === 1
                  ? 'linear-gradient(135deg, #00D4AA33, #00D4AA11)'
                  : 'linear-gradient(135deg, #1A1A2E, #16213E)',
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <div className={`h-4 ${baseSkeletonClass}`} style={{ width: `${40 + (rowIdx * 8) % 30}%` }} />
              {rowIdx % 4 === 0 && (
                <div className={`h-4 w-12 rounded-full ${baseSkeletonClass}`} />
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-24 ${baseSkeletonClass}`} />
              <div className="h-3 w-px bg-white/10" />
              <div className={`h-3 w-20 ${baseSkeletonClass}`} />
            </div>
          </div>

          {/* Right side - multiple columns */}
          <div className="hidden sm:flex items-center gap-6">
            {Array.from({ length: Math.max(cols - 2, 1) }).map((_, colIdx) => (
              <div key={colIdx} className="text-right space-y-1.5">
                <div className={`h-3 w-14 ${baseSkeletonClass} ml-auto`} />
                <div className={`h-4 w-20 ${baseSkeletonClass} ml-auto`} />
              </div>
            ))}
          </div>

          {/* Action */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${baseSkeletonClass}`} />
            <div className={`h-8 w-8 rounded-lg ${baseSkeletonClass} hidden sm:block`} />
          </div>
        </div>
      ))}

      {/* List Footer Summary */}
      <div className="mt-4 rounded-xl border border-white/5 bg-[#1A1A2E]/30 p-3 flex items-center justify-between">
        <div className={`h-4 w-40 ${baseSkeletonClass}`} />
        <div className="flex items-center gap-3">
          <div className={`h-4 w-24 ${baseSkeletonClass}`} />
          <div className={`h-8 w-24 rounded-lg ${baseSkeletonClass}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] p-4 sm:p-6">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className={`h-7 w-48 ${baseSkeletonClass}`} />
          <div className={`h-4 w-64 ${baseSkeletonClass}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className={`h-9 w-32 rounded-lg ${baseSkeletonClass}`} />
          <div className={`h-9 w-9 rounded-lg ${baseSkeletonClass}`} />
          <div
            className={`h-9 w-28 rounded-lg ${baseSkeletonClass}`}
            style={{ background: 'linear-gradient(135deg, #6C63FF33, #00D4AA33)' }}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/5 bg-[#1A1A2E]/40 p-4 space-y-2"
          >
            <div className={`h-3 w-20 ${baseSkeletonClass}`} />
            <div className={`h-6 w-16 ${baseSkeletonClass}`} />
            <div className={`h-3 w-24 ${baseSkeletonClass}`} />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      {type === 'table' && <TableSkeleton />}
      {type === 'cards' && <CardsSkeleton />}
      {type === 'list' && <ListSkeleton />}
    </div>
  );
};

export default LoadingSkeleton;