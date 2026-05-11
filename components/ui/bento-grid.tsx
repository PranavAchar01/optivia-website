import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 dark:border-white/[0.2] dark:bg-black",
        className,
      )}
    >
      {icon}
      <div className="flex flex-col gap-3 transition duration-200 group-hover/bento:translate-x-1">
        <div>{title}</div>
        <div className="flex-1">{description}</div>
      </div>
    </div>
  );
};
