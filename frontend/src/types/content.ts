export interface Practice {
  id: string;
  name: string;
  tag: string;
  description: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  summary: string;
  body: string[];
  image: string;
}

export interface Talk {
  org: string;
  role: string;
  year?: string;
  topic?: string;
}

export interface Essay {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  abstract: string;
  body: string[];
  href?: string;
}
