export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostCreate {
  title: string;
  content: string;
  summary: string;
  tags: string[];
}

export interface BlogPostUpdate extends Partial<BlogPostCreate> {
  id: string;
}
