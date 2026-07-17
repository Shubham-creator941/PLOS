

export const ActivityGraph = () => {
  // Generate mock data for 16 weeks of 7 days to simulate a contribution graph
  const weeks = Array.from({ length: 16 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 4))
  );

  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-border/30';
      case 1: return 'bg-primary/30';
      case 2: return 'bg-primary/60';
      case 3: return 'bg-primary';
      default: return 'bg-border/30';
    }
  };

  return (
    <div className="flex gap-1.5">
      {weeks.map((week, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          {week.map((level, j) => (
            <div key={`${i}-${j}`} className={`w-3 h-3 rounded-[2px] transition-colors duration-300 hover:ring-1 hover:ring-primary ${getColor(level)}`} title={`Activity level: ${level}`} />
          ))}
        </div>
      ))}
    </div>
  );
};
