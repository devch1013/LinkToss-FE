import type { DashboardStats, Deck, DeckMember, Drop, Invitation, Tag, User } from '@/types';
import {
    mockCurrentUser,
    mockDashboardStats,
    mockDeckMembers,
    mockDecks,
    mockDrops,
    mockInvitations,
    mockTags,
    mockUsers,
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

// Deck API
export const mockDeckApi = {
  async getDecks(parentId?: string | null): Promise<Deck[]> {
    await delay(200);
    if (parentId === undefined) {
      // Get all decks
      return mockDecks;
    }
    return mockDecks.filter(r => r.parentId === parentId);
  },

  async getDeck(id: string): Promise<Deck | null> {
    await delay(200);
    const deck = mockDecks.find(r => r.id === id);
    if (!deck) return null;

    // Add sub-decks
    const subDecks = mockDecks.filter(r => r.parentId === id);
    return {
      ...deck,
      subDecks: subDecks,
    };
  },

  async createDeck(data: {
    name: string;
    description: string;
    icon: string;
    isPublic: boolean;
    parentId?: string | null;
  }): Promise<Deck> {
    await delay(400);
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      userId: mockCurrentUser.id,
      parentId: data.parentId || null,
      name: data.name,
      description: data.description,
      icon: data.icon,
      isPublic: data.isPublic,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      position: mockDecks.length,
      dropCount: 0,
      subDeckCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: 'owner',
    };
    mockDecks.push(newDeck);
    return newDeck;
  },

  async updateDeck(id: string, data: Partial<Deck>): Promise<Deck> {
    await delay(300);
    const index = mockDecks.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Deck not found');

    mockDecks[index] = {
      ...mockDecks[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockDecks[index];
  },

  async deleteDeck(id: string): Promise<void> {
    await delay(300);
    const index = mockDecks.findIndex(r => r.id === id);
    if (index !== -1) {
      mockDecks.splice(index, 1);
    }
  },

  async getMembers(deckId: string): Promise<DeckMember[]> {
    await delay(200);
    return mockDeckMembers.filter(m => m.deckId === deckId);
  },

  async inviteMember(deckId: string, email: string): Promise<DeckMember> {
    await delay(400);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    const newMember: DeckMember = {
      id: `member-${Date.now()}`,
      deckId,
      userId: user.id,
      user,
      role: 'editor',
      invitedBy: mockCurrentUser.id,
      invitedAt: new Date().toISOString(),
      acceptedAt: null,
      status: 'pending',
    };
    mockDeckMembers.push(newMember);
    return newMember;
  },

  async removeMember(deckId: string, userId: string): Promise<void> {
    await delay(300);
    const index = mockDeckMembers.findIndex(
      m => m.deckId === deckId && m.userId === userId
    );
    if (index !== -1) {
      mockDeckMembers.splice(index, 1);
    }
  },
};

// Drop API
export const mockDropApi = {
  async getDrops(deckId?: string): Promise<Drop[]> {
    await delay(200);
    if (!deckId) return mockDrops;
    return mockDrops.filter(d => d.deckId === deckId);
  },

  async getDrop(id: string): Promise<Drop | null> {
    await delay(200);
    const drop = mockDrops.find(d => d.id === id);
    if (!drop) return null;

    const deck = mockDecks.find(r => r.id === drop.deckId);
    return {
      ...drop,
      deck,
    };
  },

  async createDrop(data: {
    deckId: string;
    title: string;
    url: string;
    content: string;
    tags?: string[];
  }): Promise<Drop> {
    await delay(400);
    const newDrop: Drop = {
      id: `drop-${Date.now()}`,
      deckId: data.deckId,
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
    mockDrops.push(newDrop);
    return newDrop;
  },

  async updateDrop(id: string, data: Partial<Drop>): Promise<Drop> {
    await delay(300);
    const index = mockDrops.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Drop not found');

    mockDrops[index] = {
      ...mockDrops[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockDrops[index];
  },

  async deleteDrop(id: string): Promise<void> {
    await delay(300);
    const index = mockDrops.findIndex(d => d.id === id);
    if (index !== -1) {
      mockDrops.splice(index, 1);
    }
  },

  async fetchMetadata(url: string): Promise<Partial<Drop['linkMetadata']>> {
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
      dropCount: 0,
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
      // Add to deck members
      const newMember: DeckMember = {
        id: `member-${Date.now()}`,
        deckId: invitation.deck.id,
        userId: mockCurrentUser.id,
        user: mockCurrentUser,
        role: invitation.role,
        invitedBy: invitation.invitedBy.id,
        invitedAt: invitation.invitedAt,
        acceptedAt: new Date().toISOString(),
        status: 'accepted',
      };
      mockDeckMembers.push(newMember);
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
  async search(query: string): Promise<{ decks: Deck[]; drops: Drop[] }> {
    await delay(400);
    const lowerQuery = query.toLowerCase();

    const decks = mockDecks.filter(
      r => r.name.toLowerCase().includes(lowerQuery) ||
           r.description.toLowerCase().includes(lowerQuery)
    );

    const drops = mockDrops.filter(
      d => d.title.toLowerCase().includes(lowerQuery) ||
           d.content.toLowerCase().includes(lowerQuery)
    );

    return { decks, drops };
  },
};
