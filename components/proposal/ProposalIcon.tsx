import React from 'react'
import {
  Target, Shield, Zap, CheckCircle, Calendar, Cpu, Network, Bot,
  Server, Lock, ShieldCheck, Database, FileCheck, RefreshCw,
  Users, TrendingUp, BookOpen, GitBranch, Search, Rocket, Settings,
  PenTool, MessageCircle, Star, ArrowRight, Check, ChevronRight,
  Download, Share2, Eye, Clock, AlertTriangle, Info, BarChart3,
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  target: Target,
  shield: Shield,
  zap: Zap,
  'check-circle': CheckCircle,
  calendar: Calendar,
  cpu: Cpu,
  network: Network,
  bot: Bot,
  server: Server,
  lock: Lock,
  'shield-check': ShieldCheck,
  database: Database,
  'file-check': FileCheck,
  refresh: RefreshCw,
  users: Users,
  'trending-up': TrendingUp,
  'book-open': BookOpen,
  'git-branch': GitBranch,
  search: Search,
  rocket: Rocket,
  settings: Settings,
  'pen-tool': PenTool,
  'message-circle': MessageCircle,
  star: Star,
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-right': ChevronRight,
  download: Download,
  share: Share2,
  eye: Eye,
  clock: Clock,
  alert: AlertTriangle,
  info: Info,
  chart: BarChart3,
}

interface ProposalIconProps {
  name: string
  size?: number
  className?: string
}

export function ProposalIcon({ name, size = 20, className }: ProposalIconProps) {
  const Icon = iconMap[name] ?? Info
  return <Icon size={size} className={className} />
}
