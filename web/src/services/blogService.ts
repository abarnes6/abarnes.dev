import { get, post, put, del } from './api';
import type { BlogPost, BlogPostCreate, BlogPostUpdate } from '../types';

const ENDPOINT = '/posts';

export const blogService = {
  getAll(): Promise<BlogPost[]> {
    return get<BlogPost[]>(ENDPOINT);
  },

  getBySlug(slug: string): Promise<BlogPost> {
    return get<BlogPost>(`${ENDPOINT}/${slug}`);
  },

  create(data: BlogPostCreate): Promise<BlogPost> {
    return post<BlogPost>(ENDPOINT, data);
  },

  update(data: BlogPostUpdate): Promise<BlogPost> {
    return put<BlogPost>(`${ENDPOINT}/${data.id}`, data);
  },

  delete(id: string): Promise<void> {
    return del<void>(`${ENDPOINT}/${id}`);
  },
};
