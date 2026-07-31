'use client';

type TopBarProps = {
  title: string;
  subtitle?: string;
};

export const TopBar = (props: TopBarProps) => {
  return (
    <header>
      <div className="p-3 bg-sidebar border-b border h-17.5 flex flex-col justify-center">
        <h2 className="font-bold">{props.title}</h2>
        {props.subtitle && <p className="text-sm">{props.subtitle}</p>}
      </div>
    </header>
  );
};
