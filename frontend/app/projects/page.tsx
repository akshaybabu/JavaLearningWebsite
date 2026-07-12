import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle2, Code2, Rocket } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const projectTracks = [
  {
    title: "Guided Java Builds",
    description: "Ship portfolio projects with milestones, architecture notes, and review checklists.",
    icon: Code2,
  },
  {
    title: "Backend Launch Plans",
    description: "Go from idea to REST API with deployment, testing, and release steps already mapped out.",
    icon: Rocket,
  },
  {
    title: "Career-Ready Portfolio Work",
    description: "Focus on projects that strengthen your resume, interview stories, and GitHub profile.",
    icon: Briefcase,
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="max-w-3xl">
          <Badge variant="brand" className="mb-4">
            Projects Hub
          </Badge>
          <h1 className="text-4xl font-bold text-[var(--text-primary)]">Build real Java projects without leaving the learning flow.</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
            This section is now wired up so navigation lands somewhere real. The full project workspace is still being expanded,
            but you can already jump back into roadmap planning, practice, and course work from here.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {projectTracks.map((track) => (
            <Card key={track.title} className="flex h-full flex-col gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <track.icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{track.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{track.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">What you can do right now</p>
            <div className="mt-3 space-y-2">
              {[
                "Browse the Java roadmap before choosing a build.",
                "Sharpen your coding fundamentals in Practice.",
                "Use Courses to pick the stack behind your next project.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/practice">
              <Button variant="brand" className="gap-2">
                Open Practice <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/roadmap">
              <Button variant="ghost">View Roadmap</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
