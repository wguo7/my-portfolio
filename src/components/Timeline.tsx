import { Experience } from "@/lib/schemas";
import TimelineItem from "./TimelineItem";
import { Card, CardContent } from "./ui/Card";

interface Props {
  experience: Experience[];
}

export default function Timeline({ experience }: Props) {
  return (
    <Card className="relative z-20 rounded-xl border border-white/15 bg-white/8 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/8 supports-[backdrop-filter]:[backdrop-filter:blur(14px)] supports-[backdrop-filter]:[-webkit-backdrop-filter:blur(14px)]">
      <CardContent className="p-0">
        <ul className="ml-10 border-l">
          {experience.map((exp, id) => (
            <TimelineItem key={id} experience={exp} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
