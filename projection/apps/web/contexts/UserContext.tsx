"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, UserTier, Scenario, TierFeatures, TIER_FEATURES } from '../lib/types';

interface UserContextType {
  user: User;
  scenarios: Scenario[];
  setUser: (user: User) => void;
  addScenario: (scenario: Scenario) => boolean;
  updateScenario: (id: string, scenario: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  getScenario: (id: string) => Scenario | undefined;
  canAddScenario: () => boolean;
  getTierFeatures: () => TierFeatures;
  upgradeTier: (tier: UserTier) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'nestly.user.v1';
const SCENARIOS_KEY = 'nestly.scenarios.v1';

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>({
    tier: 'free',
    isGuest: true,
  });
  
  const [scenarios, setScenariosState] = useState<Scenario[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const storedScenarios = localStorage.getItem(SCENARIOS_KEY);
    
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    
    if (storedScenarios) {
      setScenariosState(JSON.parse(storedScenarios));
    }
  }, []);

  // Save to localStorage whenever user or scenarios change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
  }, [scenarios]);

  const setUser = (newUser: User) => {
    setUserState(newUser);
  };

  const getTierFeatures = (): TierFeatures => {
    // Import at runtime to avoid circular dependency
    const { TIER_FEATURES } = require('../lib/types');
    return TIER_FEATURES[user.tier];
  };

  const canAddScenario = (): boolean => {
    const features = getTierFeatures();
    return scenarios.length < features.maxScenarios;
  };

  const addScenario = (scenario: Scenario): boolean => {
    if (!canAddScenario()) {
      return false;
    }
    
    setScenariosState(prev => [...prev, scenario]);
    return true;
  };

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setScenariosState(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteScenario = (id: string) => {
    setScenariosState(prev => prev.filter(s => s.id !== id));
  };

  const getScenario = (id: string): Scenario | undefined => {
    return scenarios.find(s => s.id === id);
  };

  const upgradeTier = (tier: UserTier) => {
    setUserState(prev => ({ ...prev, tier }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        scenarios,
        setUser,
        addScenario,
        updateScenario,
        deleteScenario,
        getScenario,
        canAddScenario,
        getTierFeatures,
        upgradeTier,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
