'use client';

function Card() {
  return (
    <div className="w-72 h-80 mx-auto bg-gray-100 rounded-xl shadow-2xl">
      <div className="flex items-center p-3">
        <div className="px-1">
          <span className="w-4 h-4 rounded-full inline-block bg-red-500 cursor-pointer"></span>
        </div>
        <div className="px-1">
          <span className="w-4 h-4 rounded-full inline-block bg-yellow-400 cursor-pointer"></span>
        </div>
        <div className="px-1">
          <span className="w-4 h-4 rounded-full inline-block bg-green-500 cursor-pointer"></span>
        </div>
      </div>
    </div>
  );
}

export default function ArchitectureCards() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1.5rem',
      alignItems: 'start',
      gridAutoRows: 'min-content',
    }}>
      <Card />
      <Card />
      <Card />
    </div>
  );
}
