interface IntroductionProps {
  children: React.ReactNode;
}

export const Introduction = ({ children }: IntroductionProps) => {
  return (
    <div
      className="bg-neutral-800/60 border-neutral-500/50 pt-10 pb-2 px-4 -translate-y-10 border-2 rounded-lg -mb-8"
      style={{
        clipPath: " polygon(45% 5%, 45% 0, 100% 0, 100% 100%, 0 100%, 0 5%)",
      }}
    >
      {children}
    </div>
  );
};
