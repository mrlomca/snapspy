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