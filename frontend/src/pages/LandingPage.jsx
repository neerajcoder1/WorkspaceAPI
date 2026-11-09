import React from 'react';
import { Link } from 'react-router-dom';
import LandingNavbar from '../components/layout/LandingNavbar';
import LandingFooter from '../components/layout/LandingFooter';
import {
  Layers,
  FolderKanban,
  CheckSquare,
  Users,
  Shield,
  Activity as ActivityIcon,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  BarChart3,
  Lock,
  ChevronRight,
  Clock,
  Briefcase,
  Play
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Layers,
      title: 'Workspace Management',
      color: 'from-purple-500 to-indigo-600',
      description:
        'Create isolated multi-tenant environments for different companies, departments, or client engagements with independent teams and settings.',
      highlights: ['Custom workspace settings', 'Multi-tenant segregation', 'Instant workspace switching'],
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      color: 'from-blue-500 to-cyan-600',
      description:
        'Organize initiatives with clear statuses (Planning, Active, Completed, Archived), start and target dates, and real-time completion tracking.',
      highlights: ['Visual status badges', 'Progress percentage metrics', 'Due date countdowns'],
    },
    {
      icon: CheckSquare,
      title: 'Smart Task Tracking',
      color: 'from-emerald-500 to-teal-600',
      description:
        'Move tasks seamlessly across Todo, In Progress, and Completed states. Assign team members, attach priority levels, and keep work flowing.',
      highlights: ['Drag & click status transitions', 'High/Medium/Low priorities', 'Assignee avatars & due dates'],
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      color: 'from-violet-500 to-purple-600',
      description:
        'Invite colleagues by email address, distribute task ownership, and maintain clear transparency over who is working on what.',
      highlights: ['One-click email invites', 'Team member directory', 'Task workload visibility'],
    },
    {
      icon: Shield,
      title: 'Role-Based Access (RBAC)',
      color: 'from-amber-500 to-orange-600',
      description:
        'Enterprise-grade security policies with distinct privileges for Owner, Admin, and Member tiers to prevent unauthorized modifications.',
      highlights: ['Owner & Admin management', 'Granular route authorization', 'Protected workspace settings'],
    },
    {
      icon: ActivityIcon,
      title: 'Real-time Activity Tracking',
      color: 'from-rose-500 to-pink-600',
      description:
        'Comprehensive audit logs track every project milestone, task assignment, status progression, and member join event chronologically.',
      highlights: ['Chronological audit trail', 'User attribution for each action', 'Real-time event timestamps'],
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Create Workspace',
      desc: 'Set up an isolated workspace for your organization or project team in seconds.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Add Team',
      desc: 'Invite engineers and managers by email with predefined Owner, Admin, or Member roles.',
      icon: Users,
    },
    {
      step: '03',
      title: 'Create Projects',
      desc: 'Define scopes, milestone goals, start dates, and projected delivery deadlines.',
      icon: FolderKanban,
    },
    {
      step: '04',
      title: 'Assign Tasks',
      desc: 'Break work down into actionable tasks, assign owners, and attach priority flags.',
      icon: CheckSquare,
    },
    {
      step: '05',
      title: 'Track Progress',
      desc: 'Watch real-time task completion rates, status updates, and chronological team logs.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-700/25 via-blue-600/25 to-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner shadow-purple-500/10 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
              <span>Team Workspace Platform</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              One Workspace. Every Project. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-300">
                Complete Control.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
              Bring your teams, projects and tasks together in one organized workspace. Plan better, collaborate faster and deliver with confidence.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-base shadow-xl shadow-purple-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-base transition"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free to start
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Team ready
              </span>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-14 relative mx-auto max-w-5xl">
            {/* Ambient Back Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/40 via-blue-500/30 to-purple-700/40 rounded-3xl blur-xl opacity-75"></div>
            
            {/* Frame */}
            <div className="relative rounded-2xl md:rounded-3xl border border-slate-700/90 bg-[#0B1020] shadow-2xl overflow-hidden p-1.5 sm:p-2">
              <img
                src="/landing-hero.jpg"
                alt="WorkSphere Application Interface Showcase"
                className="w-full h-auto rounded-xl object-cover shadow-inner"
                loading="eager"
              />
            </div>
          </div>

          {/* 4 Bottom Value Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Project Management</h4>
                <p className="text-xs text-slate-400 mt-1">Plan, track, and deliver projects.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Team Collaboration</h4>
                <p className="text-xs text-slate-400 mt-1">Work together, assign, and grow.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Real-time Insights</h4>
                <p className="text-xs text-slate-400 mt-1">Track progress with clear analytics.</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-start space-x-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Secure & Scalable</h4>
                <p className="text-xs text-slate-400 mt-1">Built with security and teams in mind.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#080D1A] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">Comprehensive Capabilities</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Everything Your Engineering Team Needs to Execute
            </p>
            <p className="text-slate-400 text-base">
              WorkSphere replaces fragmented tools with a single unified system for workspaces, roadmaps, task boards, and member permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800 p-7 hover:border-purple-500/40 hover:bg-slate-900 transition flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-300 gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Pipeline */}
      <section id="workflow" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">Streamlined Workflow</h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              How WorkSphere Powers Modern Teams
            </p>
            <p className="text-slate-400 text-base">
              From workspace initialization to sprint completion, follow a clear intuitive workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 relative flex flex-col justify-between group hover:border-blue-500/50 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-slate-600 group-hover:text-blue-400 transition">
                        {step.step}
                      </span>
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                  {idx < 4 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solutions / Architecture highlight */}
      <section id="solutions" className="py-20 bg-[#080D1A] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Production-Grade Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Engineered for Performance, Security, and Scalability
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                WorkSphere is backed by Node.js, Express, and MySQL connection pooling with rate-limiting, strict Zod schema validation, and secure bcrypt password hashing.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">RESTful JSON API</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">JWT Bearer Auth</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Parameterized Queries</span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">Real-time Activity Logs</span>
              </div>
            </div>

            <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Bring your team's work together with WorkSphere.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Eliminate silos, align project priorities, and maintain total visibility across every sprint with a fast, reliable SaaS solution.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-base shadow-xl shadow-purple-600/40 transition transform hover:-translate-y-0.5"
            >
              <span>Get Started Now � It's Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold text-sm transition"
            >
              <span>Sign In to Existing Account</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
