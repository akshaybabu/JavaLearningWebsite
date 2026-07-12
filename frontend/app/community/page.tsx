import Link from "next/link";
import { ArrowRight, MessageSquare, Users, UserRoundCheck, Trophy } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const communitySections = [
  {
    title: "Study Groups",
    description: "Find accountability loops for weekly goals, shared roadmaps, and mock practice sessions.",
    icon: Users,
  },
  {
    title: "Peer Feedback",
    description: "Review code, compare approaches, and learn how other developers solve the same Java problems.",
    icon: UserRoundCheck,
  },
  {
    title: "Challenge Nights",
    description: "Prepare for timed exercises, project demos, and interview-focused drills with other learners.",
    icon: Trophy,
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-4">
            Community
          </Badge>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">The community route is live and ready for the next layer.</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
            The navigation now lands on a dedicated community hub instead of a 404. Discussion tools and live events can be
            layered in here next, but the route itself is no longer broken.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {communitySections.map((section) => (
            <Card key={section.title} className="flex h-full flex-col gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-400">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{section.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Suggested next steps</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Keep momentum by continuing a course, opening interview prep, or heading to practice while the full social layer is
              being built out.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/interview">
              <Button variant="brand" className="gap-2">
                Interview Prep <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="ghost" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Browse Courses
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
