import React from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import LandingFooter from '../components/layout/LandingFooter';
import {
  Layers,
  FolderKanban,
  CheckSquare,
  Users,
  Activity as ActivityIcon,
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check,
  Flame,
  UserCheck
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Layers,
      title: 'Workspace Management',
      badge: 'Multi-Tenant',
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      description:
        'Create isolated team environments for companies, departments, or client projects with custom scopes and independent member permissions.',
      highlights: ['Organization boundaries', 'Instant workspace switching', 'Custom settings & branding'],
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      badge: 'Milestones',
      color: 'bg-violet-50 text-violet-600 border-violet-200',
      description:
        'Structure initiatives with clear lifecycle statuses (Planning, Active, Completed, Archived), start and due dates, and completion metrics.',
      highlights: ['Visual status indicators', 'Progress percentage tracking', 'Roadmap milestone tracking'],
    },
    {
      icon: CheckSquare,
      title: 'Smart Task Tracking',
      badge: 'Kanban Board',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      description:
        'Move tasks across Todo, In Progress, Review, and Completed states. Assign team owners, attach priority badges, and keep sprints focused.',
      highlights: ['Dynamic status columns', 'High, Medium, Low priorities', 'Assignee avatars & due dates'],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      badge: 'RBAC',
      color: 'bg-sky-50 text-sky-600 border-sky-200',
      description:
        'Invite teammates via email address, assign granular roles (Owner, Admin, Member), and maintain complete transparency across workloads.',
      highlights: ['One-click email invites', 'Role-based access permissions', 'Member directory with roles'],
    },
    {
      icon: ActivityIcon,
      title: 'Activity Tracking',
      badge: 'Audit Trail',
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      description:
        'Automatic audit logs record every task creation, status update, project milestone, and member join event chronologically.',
      highlights: ['Live event timestamps', 'Attributed user actions', 'Workspace audit transparency'],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Create Workspace',
      desc: 'Set up an isolated workspace for your organization or engineering squad in seconds.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Add Team',
      desc: 'Invite developers and managers with predefined Owner, Admin, or Member roles.',
      icon: Users,
    },
    {
      step: '03',
      title: 'Create Projects',
      desc: 'Define scope, milestones, start dates, and delivery deadlines.',
      icon: FolderKanban,
    },
    {
      step: '04',
      title: 'Assign Tasks',
      desc: 'Break work into actionable items, set priorities, and assign responsible owners.',
      icon: CheckSquare,
    },
    {
      step: '05',
      title: 'Track Progress',
      desc: 'Monitor sprint completion, Kanban board flow, and real-time activity feeds.',
      icon: ActivityIcon,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Clean Compact Navigation */}
      <LandingNavbar />

      {/* Hero Section: Two-Column Layout */}
      <section className="relative pt-12 pb-20 md:pt-18 md:pb-28 overflow-hidden bg-white">
        {/* Subtle background ambient blur */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-blue-100/50 via-purple-100/40 to-slate-100/60 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* LEFT COLUMN: Headline, Description, CTAs & Trust Indicators */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>Team Workspace Platform</span>
              </div>

              {/* Main Page Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-slate-900 leading-[1.12]">
                One Workspace. <br />
                Every Project. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-violet-600">
                  Complete Control.
                </span>
              </h1>

              {/* Body Text */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
                Bring your teams, projects and tasks together in one organized workspace. Plan better, collaborate faster and deliver with confidence.
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition shadow-2xs"
                >
                  <span>Explore Features</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center gap-5 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Free to start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Team ready
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Polished Live Dashboard Preview (Real HTML/CSS UI) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-300/60 p-3 sm:p-5 transition hover:shadow-3xl">
                
                {/* Window Header */}
                <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-semibold text-slate-400">app.worksphere.io</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[11px] font-semibold text-slate-500">VisionX Engineering</span>
                  </div>
                </div>

                {/* Dashboard Header Bar */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/70 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      V
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 leading-tight">VisionX Engineering</p>
                      <p className="text-[10px] text-slate-500 font-medium">8 active projects • 6 members</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                    Active Workspace
                  </span>
                </div>

                {/* 3 Metric Summary Cards */}
                <div className="grid grid-cols-3 gap-2.5 mb-4 text-left">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Projects</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">8 <span className="text-[10px] text-emerald-600 font-bold">+2</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Tasks</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">24 <span className="text-[10px] text-blue-600 font-bold">Live</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase">Completed</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">12 <span className="text-[10px] text-emerald-600 font-bold">50%</span></p>
                  </div>
                </div>

                {/* Mini Kanban Task Board Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>Sprint Tasks</span>
                    <span className="text-[11px] text-blue-600 font-semibold">Board View</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Todo Column */}
                    <div className="bg-slate-50/90 rounded-xl p-2.5 border border-slate-200/70 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-600">To Do</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">4</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200/80 shadow-2xs space-y-1.5">
                        <p className="text-[11px] font-semibold text-slate-800 leading-tight">Database schema</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Medium</span>
                          <span className="text-[9px] text-slate-400">Nov 15</span>
                        </div>
                      </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-900">In Progress</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-white px-1.5 py-0.5 rounded border border-blue-200">6</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-blue-200/80 shadow-2xs space-y-1.5">
                        <p className="text-[11px] font-semibold text-slate-900 leading-tight">Implement CRUD API</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">High</span>
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center">N</div>
                        </div>
                      </div>
                    </div>

                    {/* Done Column */}
                    <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-900">Completed</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-200">12</span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-emerald-200/80 shadow-2xs space-y-1.5">
                        <p className="text-[11px] font-semibold text-slate-800 leading-tight">JWT Auth Module</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Done</span>
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Five Core Features Section */}
      <section id="features" className="py-20 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Everything Your Engineering Team Needs to Execute
            </h2>
            <p className="text-slate-600 text-base">
              WorkSphere replaces disconnected spreadsheets and chaotic chat threads with a single unified workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 p-7 shadow-xs hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-11 h-11 rounded-xl ${item.color} border flex items-center justify-center font-bold shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-600 gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Sixth card: High Performance Architecture */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-7 shadow-md flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Hardened Security & Scalability
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Engineered with Node.js, Express, MySQL connection pooling, rate limiting, and bcrypt encryption to ensure zero data leakage.
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-white/20">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white hover:underline"
                >
                  <span>Create your workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How it Works / Workflow Pipeline */}
      <section id="workflow" className="py-20 md:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Intuitive Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              How WorkSphere Works
            </h2>
            <p className="text-slate-600 text-base">
              A clean 5-step operational workflow from workspace creation to task delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative flex flex-col justify-between group hover:border-blue-400 hover:bg-white transition shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-slate-300 group-hover:text-blue-600 transition">
                        {step.step}
                      </span>
                      <div className="p-2 rounded-xl bg-white border border-slate-200 text-blue-600 shadow-2xs">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{step.desc}</p>
                  </div>
                  {idx < 4 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Production Architecture Section */}
      <section id="architecture" className="py-18 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
            
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Production-Grade Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Engineered for Performance, Security, and Scalability
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                WorkSphere is backed by Node.js, Express, and MySQL connection pooling with rate-limiting, strict Zod schema validation, and secure bcrypt password hashing.
              </p>
              <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-700">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">Multi-Tenant Workspaces</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">JWT Bearer Auth</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">Role-Based Access (RBAC)</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">Real-time Activity Logs</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition transform hover:-translate-y-0.5"
              >
                <span>Create Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 md:py-24 bg-white border-t border-slate-200 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Bring your team's work together with WorkSphere.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminate silos, align project priorities, and maintain total visibility across every sprint with a fast, modern SaaS solution.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Now — It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm transition"
            >
              <span>Sign In to Existing Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Light Enterprise Footer */}
      <LandingFooter />
    </div>
  );
}
