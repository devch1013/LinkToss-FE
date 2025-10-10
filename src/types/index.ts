// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  emailVerified: boolean;
  createdAt: string;
}

// Repository Types
export interface Repository {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  description: string;
  icon: string;
  isPublic: boolean;
  slug: string;
  position: number;
  documentCount: number;
  subRepositoryCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  subRepositories?: Repository[];
  role?: 'owner' | 'editor'; // 현재 사용자의 역할
}

// Document Types
export interface Document {
  id: string;
  repositoryId: string;
  userId: string;
  title: string;
  url: string;
  content: string;
  contentPreview?: string;
  linkMetadata: LinkMetadata;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  repository?: Repository;
}

export interface LinkMetadata {
  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string;
  ogUrl?: string;
  favicon?: string;
  siteName?: string;
  type?: string;
  fetchedAt?: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  color: string;
  documentCount?: number;
  createdAt?: string;
}

// Member Types
export interface RepositoryMember {
  id: string;
  repositoryId: string;
  userId: string;
  user: User;
  role: 'owner' | 'editor';
  invitedBy: string | null;
  invitedAt: string;
  acceptedAt: string | null;
  status?: 'pending' | 'accepted' | 'rejected';
}

// Invitation Types
export interface Invitation {
  id: string;
  repository: Repository;
  invitedBy: User;
  role: 'editor';
  invitedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Stats Types
export interface DashboardStats {
  overview: {
    repositoryCount: number;
    documentCount: number;
    publicRepositoryCount: number;
    tagCount: number;
  };
  recentDocuments: Document[];
  frequentRepositories: Repository[];
}
