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

// Deck Types
export interface Deck {
  id: string;
  userId: string;
  parentId: string | null;
  name: string;
  description: string;
  icon: string;
  isPublic: boolean;
  slug: string;
  position: number;
  dropCount: number;
  subDeckCount: number;
  createdAt: string;
  updatedAt: string;
  user?: User;
  subDecks?: Deck[];
  role?: 'owner' | 'editor'; // 현재 사용자의 역할
}

// Drop Types
export interface Drop {
  id: string;
  deckId: string;
  userId: string;
  title: string;
  url: string;
  content: string;
  contentPreview?: string;
  linkMetadata: LinkMetadata;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
  deck?: Deck;
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
  dropCount?: number;
  createdAt?: string;
}

// Member Types
export interface DeckMember {
  id: string;
  deckId: string;
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
  deck: Deck;
  invitedBy: User;
  role: 'editor';
  invitedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Stats Types
export interface DashboardStats {
  overview: {
    deckCount: number;
    dropCount: number;
    publicDeckCount: number;
    tagCount: number;
  };
  recentDrops: Drop[];
  frequentDecks: Deck[];
}
