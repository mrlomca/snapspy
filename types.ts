import React from 'react';

export enum FeatureType {
  SCORE_CHECKS = 'SCORE_CHECKS',
  BEST_FRIENDS = 'BEST_FRIENDS',
  EYES_ONLY = 'EYES_ONLY',
  CHAT_HISTORY = 'CHAT_HISTORY'
}

export interface Feature {
  id: FeatureType;
  title: string;
  description: string;
  icon: React.ReactNode;
  locked?: boolean;
}

export interface UserData {
  username: string;
  avatarUrl: string;
}

export interface SnapProfile {
  found: boolean;
  reason?: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  snapcodeUrl: string | null;
  bio: string | null;
  subscriberCount: number | null;
  website: string | null;
  verified: boolean;
  isPublicProfile: boolean;
}