import React, { useEffect, useState } from "react";

// 인위적인 지연을 추가하는 함수
const artificialDelay = (ms: number) => {
  const start = Date.now();
  while (Date.now() - start < ms) {
    // 빈 루프로 CPU를 점유
  }
};

interface ExpensiveRenderItemProps {
  id: number | string;
  title: string;
  onClick?: () => void;
}

export const SlowItem: React.FC<ExpensiveRenderItemProps> = ({ id, title, onClick }) => {
  const [animationOffset, setAnimationOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationOffset((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const generateComplexPath = () => {
    let path = "M0 0 ";
    for (let i = 0; i < 100; i++) {
      const x = i * 3;
      const y = Math.sin(i * 0.1 + animationOffset * 0.05) * 20 + 50;
      path += `L${x} ${y} `;
    }
    return path;
  };

  return (
    <div onClick={onClick} style={{ margin: "10px 0", padding: "10px", border: "1px solid #ddd" }}>
      <h3>{title}</h3>
      <p>ID: {id}</p>
      <svg width="300" height="100" viewBox="0 0 300 100">
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff9a9e" />
            <stop offset="100%" stopColor="#fad0c4" />
          </linearGradient>
        </defs>
        <path d={generateComplexPath()} stroke={`url(#gradient-${id})`} strokeWidth="2" fill="none" />
        {Array.from({ length: 20 }).map((_, index) => (
          <circle
            key={index}
            cx={index * 15}
            cy={50 + Math.sin((index + animationOffset) * 0.2) * 20}
            r="3"
            fill={`hsl(${(index * 20 + animationOffset) % 360}, 70%, 60%)`}
          />
        ))}
      </svg>
    </div>
  );
};
SlowItem.displayName = "SlowItem";
