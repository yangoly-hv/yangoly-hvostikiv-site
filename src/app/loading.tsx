const Loading = () => {
  const letters = "Loading...".split("");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF7E5]">
      <div className="flex space-x-1">
        {letters.map((letter, index) => (
          <span
            key={index}
            className="inline-block text-5xl custom-wave font-['Sour_Gummy']"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loading;
