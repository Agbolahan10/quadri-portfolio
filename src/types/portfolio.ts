// src/types/portfolio.ts

export type SkillCategory = 'all' | 'frontend' | 'workflow' | 'devops' | 'qa';

export interface SkillItem {
  name: string;
  category: Exclude<SkillCategory, 'all'>;
  level: string;
  context: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  sub: string;
  type: 'client' | 'gateway' | 'engine' | 'core';
  latency: string;
  detail: string;
}

export interface CaseStudy {
  id: string;
  index: string;
  title: string;
  domain: string;
  metrics: string[];
  stack: string[];
  car: {
    context: string;
    action: string;
    result: string;
  };
  architectureNodes: ArchitectureNode[];
}

export interface TechnicalArticle {
  id: string;
  title: string;
  category: 'Architecture & BPMN' | 'Cloud & DevOps' | 'Quality Engineering';
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  codeSnippet: string;
}

// Backend API Contract for the Contact Dispatch Engine
export interface ContactDispatchPayload {
  senderName: string;
  senderEmail: string;
  intent: 'Enterprise Role' | 'Digital Transformation / Consulting' | 'Technical Collaboration';
  message: string;
}