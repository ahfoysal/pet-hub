interface DashboardHeadingProps {
  title: string;
  description?: string;
}

export default function DashboardHeading({
  title,
  description,
}: DashboardHeadingProps) {
  return (
    <div>
      <h1 className="text-xl md:text-3xl  text-foreground font-bold">{title}</h1>
      <p className="text-secondary mt-1">{description ? description : ""}</p>
    </div>
  );
}
