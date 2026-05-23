"use client";

import { useState } from "react";

type RoleCategory = "Tech" | "Tutoring" | "Art" | "Casual" | "Freelance";
type Recommendation = "Apply" | "Maybe" | "Skip";
type PillTone = "neutral" | "success" | "warning" | "danger";

type Skill = {
  label: string;
  terms: string[];
  categories: RoleCategory[];
};

type RedFlagRule = {
  label: string;
  terms: string[];
  severity: "medium" | "high";
};

type Analysis = {
  fitScore: number;
  recommendation: Recommendation;
  profileSkills: string[];
  jobSkills: string[];
  matchingSkills: string[];
  missingSkills: string[];
  redFlags: string[];
  coverLetter: string;
};

const roleCategories: RoleCategory[] = [
  "Tech",
  "Tutoring",
  "Art",
  "Casual",
  "Freelance",
];

const skillCatalog: Skill[] = [
  {
    label: "JavaScript",
    terms: ["javascript", "js"],
    categories: ["Tech", "Freelance"],
  },
  {
    label: "TypeScript",
    terms: ["typescript", "ts"],
    categories: ["Tech", "Freelance"],
  },
  { label: "React", terms: ["react"], categories: ["Tech", "Freelance"] },
  {
    label: "Next.js",
    terms: ["next.js", "nextjs", "next js"],
    categories: ["Tech", "Freelance"],
  },
  { label: "Node.js", terms: ["node", "node.js"], categories: ["Tech"] },
  { label: "Python", terms: ["python"], categories: ["Tech", "Tutoring"] },
  { label: "SQL", terms: ["sql", "database"], categories: ["Tech"] },
  { label: "APIs", terms: ["api", "apis"], categories: ["Tech", "Freelance"] },
  {
    label: "Testing",
    terms: ["testing", "unit tests", "qa"],
    categories: ["Tech"],
  },
  { label: "Git", terms: ["git", "github"], categories: ["Tech"] },
  {
    label: "Teaching",
    terms: ["teaching", "teach", "teacher"],
    categories: ["Tutoring"],
  },
  {
    label: "Lesson Planning",
    terms: ["lesson planning", "lesson plans"],
    categories: ["Tutoring"],
  },
  { label: "Math", terms: ["math", "maths"], categories: ["Tutoring"] },
  { label: "English", terms: ["english", "writing"], categories: ["Tutoring"] },
  {
    label: "Feedback",
    terms: ["feedback", "marking"],
    categories: ["Tutoring"],
  },
  {
    label: "Mentoring",
    terms: ["mentoring", "mentor"],
    categories: ["Tutoring", "Freelance"],
  },
  {
    label: "Illustration",
    terms: ["illustration", "illustrator", "drawing"],
    categories: ["Art"],
  },
  {
    label: "Design",
    terms: ["design", "visual design", "graphic design"],
    categories: ["Art", "Freelance"],
  },
  {
    label: "Photoshop",
    terms: ["photoshop", "adobe photoshop"],
    categories: ["Art"],
  },
  {
    label: "Portfolio",
    terms: ["portfolio", "case studies"],
    categories: ["Art", "Freelance"],
  },
  { label: "Branding", terms: ["branding", "brand"], categories: ["Art"] },
  {
    label: "Animation",
    terms: ["animation", "motion"],
    categories: ["Art"],
  },
  {
    label: "Customer Service",
    terms: ["customer service", "customers"],
    categories: ["Casual"],
  },
  {
    label: "Cash Handling",
    terms: ["cash handling", "cash register"],
    categories: ["Casual"],
  },
  { label: "Retail", terms: ["retail", "store"], categories: ["Casual"] },
  {
    label: "Hospitality",
    terms: ["hospitality", "cafe", "restaurant", "barista"],
    categories: ["Casual"],
  },
  {
    label: "Availability",
    terms: ["availability", "available", "roster"],
    categories: ["Casual"],
  },
  {
    label: "Client Communication",
    terms: ["client communication", "client management"],
    categories: ["Freelance"],
  },
  {
    label: "Project Management",
    terms: ["project management", "project delivery"],
    categories: ["Tech", "Freelance"],
  },
  {
    label: "Deadlines",
    terms: ["deadline", "deadlines", "timeframes"],
    categories: ["Freelance", "Casual"],
  },
  { label: "Remote Work", terms: ["remote", "online"], categories: ["Freelance"] },
  {
    label: "Communication",
    terms: ["communication", "communicate"],
    categories: ["Tech", "Tutoring", "Art", "Casual", "Freelance"],
  },
  {
    label: "Teamwork",
    terms: ["teamwork", "team player", "collaboration"],
    categories: ["Tech", "Tutoring", "Art", "Casual", "Freelance"],
  },
  {
    label: "Problem Solving",
    terms: ["problem solving", "troubleshooting"],
    categories: ["Tech", "Tutoring", "Art", "Casual", "Freelance"],
  },
  {
    label: "Attention to Detail",
    terms: ["attention to detail", "detail oriented"],
    categories: ["Tech", "Tutoring", "Art", "Casual", "Freelance"],
  },
];

const redFlagRules: RedFlagRule[] = [
  {
    label: "Unpaid trial",
    terms: ["unpaid trial", "unpaid training", "free trial shift"],
    severity: "high",
  },
  {
    label: "Commission only",
    terms: ["commission only", "commission-only", "100% commission"],
    severity: "high",
  },
  {
    label: "WhatsApp only",
    terms: ["whatsapp only", "whatsapp me", "message on whatsapp"],
    severity: "medium",
  },
  {
    label: "Urgent hiring",
    terms: ["urgent hiring", "urgently hiring", "immediate start", "start today"],
    severity: "medium",
  },
  {
    label: "Pay to apply",
    terms: ["pay to apply", "application fee", "processing fee", "training fee"],
    severity: "high",
  },
];

const sampleProfile =
  "Frontend developer with React, TypeScript, Next.js, APIs, testing, Git, communication, and project management experience. I have shipped portfolio projects and collaborated remotely with small teams.";

const sampleJob =
  "We need a freelance frontend developer for a remote product dashboard. Must have React, TypeScript, Next.js, API integration, testing, portfolio examples, clear communication, and project delivery skills. Pay range is listed as $45-$60 per hour.";

const initialCoverLetter =
  "Run an analysis to generate a short draft cover letter tailored to the selected category.";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasTerm(text: string, term: string) {
  const cleanedTerm = term.toLowerCase().trim();

  if (!cleanedTerm) {
    return false;
  }

  if (/[^a-z0-9\s]/.test(cleanedTerm)) {
    return text.includes(cleanedTerm);
  }

  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(cleanedTerm)}([^a-z0-9]|$)`).test(
    text,
  );
}

function extractSkills(text: string) {
  const normalizedText = text.toLowerCase();

  return skillCatalog
    .filter((skill) => skill.terms.some((term) => hasTerm(normalizedText, term)))
    .map((skill) => skill.label);
}

function detectRedFlags(jobText: string) {
  const normalizedText = jobText.toLowerCase();
  const matches = redFlagRules.filter((rule) =>
    rule.terms.some((term) => hasTerm(normalizedText, term)),
  );
  const redFlags = matches.map((rule) => rule.label);

  const hasPaySignal = [
    "$",
    "aud",
    "salary",
    "pay",
    "paid",
    "wage",
    "rate",
    "per hour",
    "hourly",
    "compensation",
  ].some((term) => normalizedText.includes(term));

  if (jobText.trim().length > 80 && !hasPaySignal) {
    redFlags.push("No pay listed");
  }

  return {
    redFlags,
    highSeverityCount: matches.filter((rule) => rule.severity === "high").length,
  };
}

function getRoleSignal(jobSkills: string[], roleCategory: RoleCategory) {
  const roleSkillLabels = skillCatalog
    .filter((skill) => skill.categories.includes(roleCategory))
    .map((skill) => skill.label);

  return jobSkills.filter((skill) => roleSkillLabels.includes(skill)).length;
}

function calculateFitScore({
  profileSkills,
  jobSkills,
  matchingSkills,
  roleSignal,
  redFlags,
}: {
  profileSkills: string[];
  jobSkills: string[];
  matchingSkills: string[];
  roleSignal: number;
  redFlags: string[];
}) {
  if (profileSkills.length === 0 || jobSkills.length === 0) {
    return 24;
  }

  const matchRatio = matchingSkills.length / jobSkills.length;
  const breadthBonus = Math.min(profileSkills.length * 1.4, 10);
  const roleBonus = Math.min(roleSignal * 2.5, 12);
  const redFlagPenalty = redFlags.length * 7;

  return Math.max(
    8,
    Math.min(96, Math.round(28 + matchRatio * 52 + breadthBonus + roleBonus - redFlagPenalty)),
  );
}

function getRecommendation(
  fitScore: number,
  redFlags: string[],
  highSeverityCount: number,
): Recommendation {
  if (redFlags.includes("Pay to apply") || highSeverityCount >= 2 || fitScore < 42) {
    return "Skip";
  }

  if (fitScore >= 74 && redFlags.length <= 1) {
    return "Apply";
  }

  return "Maybe";
}

function makeCoverLetter(
  roleCategory: RoleCategory,
  matchingSkills: string[],
  missingSkills: string[],
  recommendation: Recommendation,
) {
  const categoryFocus: Record<RoleCategory, string> = {
    Tech: "building reliable products and solving practical technical problems",
    Tutoring: "helping students build confidence through clear guidance",
    Art: "turning ideas into polished visual work with a thoughtful creative process",
    Casual: "bringing dependable service, teamwork, and a steady customer focus",
    Freelance: "communicating clearly, managing scope, and delivering work on time",
  };

  const strengths =
    matchingSkills.length > 0
      ? matchingSkills.slice(0, 4).join(", ")
      : "relevant experience and a willingness to learn";
  const growth =
    missingSkills.length > 0
      ? `I would also be ready to strengthen my experience with ${missingSkills
          .slice(0, 2)
          .join(" and ")} if needed.`
      : "The role appears to align well with my current skill set.";
  const tone =
    recommendation === "Apply"
      ? "I am excited to apply"
      : recommendation === "Maybe"
        ? "I am interested in discussing whether my background is the right fit"
        : "If I chose to apply, I would want to clarify the role expectations first";

  return `Dear hiring team,\n\n${tone} for this ${roleCategory.toLowerCase()} opportunity. My background includes ${strengths}, and I am especially drawn to ${categoryFocus[roleCategory]}.\n\n${growth}\n\nThank you for considering my application. I would welcome the chance to discuss how I could contribute.\n\nKind regards,`;
}

function analyzeFit(
  profileText: string,
  jobText: string,
  roleCategory: RoleCategory,
): Analysis {
  const profileSkills = extractSkills(profileText);
  const jobSkills = extractSkills(jobText);
  const matchingSkills = jobSkills.filter((skill) => profileSkills.includes(skill));
  const missingSkills = jobSkills.filter((skill) => !profileSkills.includes(skill));
  const { redFlags, highSeverityCount } = detectRedFlags(jobText);
  const roleSignal = getRoleSignal(jobSkills, roleCategory);
  const fitScore = calculateFitScore({
    profileSkills,
    jobSkills,
    matchingSkills,
    roleSignal,
    redFlags,
  });
  const recommendation = getRecommendation(fitScore, redFlags, highSeverityCount);

  return {
    fitScore,
    recommendation,
    profileSkills,
    jobSkills,
    matchingSkills,
    missingSkills,
    redFlags,
    coverLetter: makeCoverLetter(
      roleCategory,
      matchingSkills,
      missingSkills,
      recommendation,
    ),
  };
}

function ResultCard({
  title,
  children,
  accent = "bg-slate-900",
}: {
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
      <div className={`mb-4 h-1 w-10 rounded-sm ${accent}`} />
      <h2 className="text-xs font-semibold uppercase tracking-normal text-slate-500">
        {title}
      </h2>
      <div className="mt-3 text-slate-950">{children}</div>
    </section>
  );
}

function PillList({
  items,
  fallback,
  tone = "neutral",
}: {
  items: string[];
  fallback: string;
  tone?: PillTone;
}) {
  const tones: Record<PillTone, string> = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    danger: "border-rose-200 bg-rose-50 text-rose-800",
  };
  const displayItems = items.length > 0 ? items : [fallback];

  return (
    <div className="flex flex-wrap gap-2">
      {displayItems.map((item) => (
        <span
          key={item}
          className={`rounded-md border px-3 py-1.5 text-sm ${tones[tone]}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 74) {
    return "bg-emerald-600";
  }

  if (score >= 50) {
    return "bg-amber-500";
  }

  return "bg-rose-500";
}

function recommendationStyle(recommendation: Recommendation) {
  if (recommendation === "Apply") {
    return "bg-emerald-50 text-emerald-800 ring-emerald-200";
  }

  if (recommendation === "Maybe") {
    return "bg-amber-50 text-amber-800 ring-amber-200";
  }

  return "bg-rose-50 text-rose-800 ring-rose-200";
}

export default function Home() {
  const [profileText, setProfileText] = useState("");
  const [jobText, setJobText] = useState("");
  const [roleCategory, setRoleCategory] = useState<RoleCategory>("Tech");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const hasInputs = profileText.trim().length > 0 && jobText.trim().length > 0;
  const score = analysis?.fitScore ?? 0;
  const recommendation = analysis?.recommendation ?? "Maybe";

  function runAnalysis() {
    if (!hasInputs) {
      setAnalysis(null);
      return;
    }

    setAnalysis(analyzeFit(profileText, jobText, roleCategory));
  }

  function trySample() {
    setProfileText(sampleProfile);
    setJobText(sampleJob);
    setRoleCategory("Tech");
    setAnalysis(analyzeFit(sampleProfile, sampleJob, "Tech"));
  }

  function clearInputs() {
    setProfileText("");
    setJobText("");
    setRoleCategory("Tech");
    setAnalysis(null);
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
          <section>
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
              JobPilot
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl">
              Find the jobs worth applying for.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Paste your resume and a job description. JobPilot gives a fit score,
              red flags, and tailored application guidance.
            </p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-500">MVP status</span>
              <span className="rounded-md bg-teal-50 px-2.5 py-1 text-sm font-semibold text-teal-800">
                Local
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div>
                <p className="text-2xl font-semibold text-slate-950">0</p>
                <p className="text-xs text-slate-500">APIs</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-950">0</p>
                <p className="text-xs text-slate-500">Logins</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-950">0</p>
                <p className="text-xs text-slate-500">Storage</p>
              </div>
            </div>
          </section>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/70 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-950">Job analysis</h2>
              <button
                type="button"
                onClick={clearInputs}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">
                  Resume/profile text
                </span>
                <textarea
                  value={profileText}
                  onChange={(event) => setProfileText(event.target.value)}
                  className="mt-2 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100 sm:min-h-48"
                  placeholder="Experience, skills, education, availability..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">
                  Job description
                </span>
                <textarea
                  value={jobText}
                  onChange={(event) => setJobText(event.target.value)}
                  className="mt-2 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100 sm:min-h-48"
                  placeholder="Responsibilities, requirements, pay, location, hours..."
                />
              </label>

              <fieldset>
                <legend className="text-sm font-medium text-slate-800">
                  Target role category
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {roleCategories.map((category) => {
                    const selected = roleCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setRoleCategory(category)}
                        className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition ${
                          selected
                            ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                        }`}
                        aria-pressed={selected}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={runAnalysis}
                  disabled={!hasInputs}
                  className="rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Analyse job
                </button>
                <button
                  type="button"
                  onClick={trySample}
                  className="rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Try sample
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard title="Fit score" accent={scoreColor(score)}>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-semibold tabular-nums">
                    {score}
                  </span>
                  <span className="pb-2 text-lg text-slate-500">/ 100</span>
                </div>
                <div className="mt-4 h-2 rounded-sm bg-slate-200">
                  <div
                    className={`h-2 rounded-sm transition-all ${scoreColor(score)}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </ResultCard>

              <ResultCard title="Recommendation" accent="bg-sky-600">
                <p
                  className={`inline-flex rounded-md px-3 py-2 text-xl font-semibold ring-1 ${recommendationStyle(
                    recommendation,
                  )}`}
                >
                  {analysis ? recommendation : "Ready"}
                </p>
              </ResultCard>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ResultCard title="Resume skills found" accent="bg-indigo-600">
                <PillList
                  items={analysis?.profileSkills ?? []}
                  fallback="Run analysis to extract skills"
                />
              </ResultCard>

              <ResultCard title="Job skills found" accent="bg-cyan-600">
                <PillList
                  items={analysis?.jobSkills ?? []}
                  fallback="Run analysis to extract skills"
                />
              </ResultCard>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <ResultCard title="Matching skills" accent="bg-emerald-600">
                <PillList
                  items={analysis?.matchingSkills ?? []}
                  fallback="No matches yet"
                  tone="success"
                />
              </ResultCard>

              <ResultCard title="Missing skills" accent="bg-amber-500">
                <PillList
                  items={analysis?.missingSkills ?? []}
                  fallback="No gaps detected yet"
                  tone="warning"
                />
              </ResultCard>

              <ResultCard title="Red flags" accent="bg-rose-500">
                <PillList
                  items={analysis?.redFlags ?? []}
                  fallback="No red flags detected"
                  tone={analysis?.redFlags.length ? "danger" : "neutral"}
                />
              </ResultCard>
            </div>

            <ResultCard title="Draft cover letter" accent="bg-violet-600">
              <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 font-sans text-sm leading-6 text-slate-700">
                {analysis?.coverLetter ?? initialCoverLetter}
              </pre>
            </ResultCard>
          </section>
        </div>
      </div>
    </main>
  );
}
