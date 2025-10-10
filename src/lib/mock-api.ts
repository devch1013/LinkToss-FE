import type { User, Repository, Document, Tag, RepositoryMember, Invitation, DashboardStats } from '@/types';
import {
  mockCurrentUser,
  mockUsers,
  mockRepositories,
  mockDocuments,
  mockTags,
  mockRepositoryMembers,
  mockInvitations,
  mockDashboardStats,
} from './mock-data';

// Simulated API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Auth Session Storage
let currentUser: User | null = null;

// Auth API
export const mockAuthApi = {
  async loginWithGoogle(code: string): Promise<{ user: User; accessToken: string }> {
    await delay(500);
    currentUser = mockCurrentUser;
    return {
      user: mockCurrentUser,
      accessToken: 'mock_access_token_google',
    };
  },

  async loginWithGithub(code: string): Promise<{ user: User; accessToken: string }> {
    await delay(500);
    currentUser = mockCurrentUser;
    return {
      user: mockCurrentUser,
      accessToken: 'mock_access_token_github',
    };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return currentUser || mockCurrentUser; // Demo에서는 항상 로그인된 것으로
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(300);
    return { ...mockCurrentUser, ...data };
  },
};

// Repository API
export const mockRepositoryApi = {
  async getRepositories(parentId?: string | null): Promise<Repository[]> {
    await delay(200);
    if (parentId === undefined) {
      // Get all repositories
      return mockRepositories;
    }
    return mockRepositories.filter(r => r.parentId === parentId);
  },

  async getRepository(id: string): Promise<Repository | null> {
    await delay(200);
    const repo = mockRepositories.find(r => r.id === id);
    if (!repo) return null;

    // Add sub-repositories
    const subRepos = mockRepositories.filter(r => r.parentId === id);
    return {
      ...repo,
      subRepositories: subRepos,
    };
  },

  async createRepository(data: {
    name: string;
    description: string;
    icon: string;
    isPublic: boolean;
    parentId?: string | null;
  }): Promise<Repository> {
    await delay(400);
    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      userId: mockCurrentUser.id,
      parentId: data.parentId || null,
      name: data.name,
      description: data.description,
      icon: data.icon,
      isPublic: data.isPublic,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      position: mockRepositories.length,
      documentCount: 0,
      subRepositoryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'owner',
    };
    mockRepositories.push(newRepo);
    return newRepo;
  },

  async updateRepository(id: string, data: Partial<Repository>): Promise<Repository> {
    await delay(300);
    const index = mockRepositories.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Repository not found');

    mockRepositories[index] = {
      ...mockRepositories[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockRepositories[index];
  },

  async deleteRepository(id: string): Promise<void> {
    await delay(300);
    const index = mockRepositories.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRepositories.splice(index, 1);
    }
  },

  async getMembers(repositoryId: string): Promise<RepositoryMember[]> {
    await delay(200);
    return mockRepositoryMembers.filter(m => m.repositoryId === repositoryId);
  },

  async inviteMember(repositoryId: string, email: string): Promise<RepositoryMember> {
    await delay(400);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    const newMember: RepositoryMember = {
      id: `member-${Date.now()}`,
      repositoryId,
      userId: user.id,
      user,
      role: 'editor',
      invitedBy: mockCurrentUser.id,
      invitedAt: new Date().toISOString(),
      acceptedAt: null,
      status: 'pending',
    };
    mockRepositoryMembers.push(newMember);
    return newMember;
  },

  async removeMember(repositoryId: string, userId: string): Promise<void> {
    await delay(300);
    const index = mockRepositoryMembers.findIndex(
      m => m.repositoryId === repositoryId && m.userId === userId
    );
    if (index !== -1) {
      mockRepositoryMembers.splice(index, 1);
    }
  },
};

// Document API
export const mockDocumentApi = {
  async getDocuments(repositoryId?: string): Promise<Document[]> {
    await delay(200);
    if (!repositoryId) return mockDocuments;
    return mockDocuments.filter(d => d.repositoryId === repositoryId);
  },

  async getDocument(id: string): Promise<Document | null> {
    await delay(200);
    const doc = mockDocuments.find(d => d.id === id);
    if (!doc) return null;

    const repository = mockRepositories.find(r => r.id === doc.repositoryId);
    return {
      ...doc,
      repository,
    };
  },

  async createDocument(data: {
    repositoryId: string;
    title: string;
    url: string;
    content: string;
    tags?: string[];
  }): Promise<Document> {
    await delay(400);
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      repositoryId: data.repositoryId,
      userId: mockCurrentUser.id,
      title: data.title,
      url: data.url,
      content: data.content,
      contentPreview: data.content.slice(0, 100),
      linkMetadata: {
        ogTitle: data.title,
        ogUrl: data.url,
      },
      tags: data.tags?.map(tagName => {
        const existing = mockTags.find(t => t.name === tagName);
        return existing || { id: `tag-${Date.now()}`, name: tagName, color: '#999999' };
      }) || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDocuments.push(newDoc);
    return newDoc;
  },

  async updateDocument(id: string, data: Partial<Document>): Promise<Document> {
    await delay(300);
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Document not found');

    mockDocuments[index] = {
      ...mockDocuments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockDocuments[index];
  },

  async deleteDocument(id: string): Promise<void> {
    await delay(300);
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDocuments.splice(index, 1);
    }
  },

  async fetchMetadata(url: string): Promise<Partial<Document['linkMetadata']>> {
    await delay(600);
    // Simulate fetching metadata
    return {
      ogTitle: `Title for ${url}`,
      ogDescription: 'Description from the website',
      ogImage: 'https://via.placeholder.com/1200x630',
    };
  },
};

// Tag API
export const mockTagApi = {
  async getTags(): Promise<Tag[]> {
    await delay(100);
    return mockTags;
  },

  async createTag(name: string, color: string): Promise<Tag> {
    await delay(200);
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color,
      documentCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockTags.push(newTag);
    return newTag;
  },
};

// Invitation API
export const mockInvitationApi = {
  async getInvitations(): Promise<Invitation[]> {
    await delay(200);
    return mockInvitations;
  },

  async acceptInvitation(id: string): Promise<void> {
    await delay(300);
    const invitation = mockInvitations.find(i => i.id === id);
    if (invitation) {
      invitation.status = 'accepted';
      // Add to repository members
      const newMember: RepositoryMember = {
        id: `member-${Date.now()}`,
        repositoryId: invitation.repository.id,
        userId: mockCurrentUser.id,
        user: mockCurrentUser,
        role: invitation.role,
        invitedBy: invitation.invitedBy.id,
        invitedAt: invitation.invitedAt,
        acceptedAt: new Date().toISOString(),
        status: 'accepted',
      };
      mockRepositoryMembers.push(newMember);
    }
  },

  async rejectInvitation(id: string): Promise<void> {
    await delay(300);
    const invitation = mockInvitations.find(i => i.id === id);
    if (invitation) {
      invitation.status = 'rejected';
    }
  },
};

// Stats API
export const mockStatsApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(300);
    return mockDashboardStats;
  },
};

// Search API
export const mockSearchApi = {
  async search(query: string): Promise<{ repositories: Repository[]; documents: Document[] }> {
    await delay(400);
    const lowerQuery = query.toLowerCase();

    const repositories = mockRepositories.filter(
      r => r.name.toLowerCase().includes(lowerQuery) ||
           r.description.toLowerCase().includes(lowerQuery)
    );

    const documents = mockDocuments.filter(
      d => d.title.toLowerCase().includes(lowerQuery) ||
           d.content.toLowerCase().includes(lowerQuery)
    );

    return { repositories, documents };
  },
};
