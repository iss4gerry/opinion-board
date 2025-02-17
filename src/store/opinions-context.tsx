import React, { createContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of an opinion
interface Opinion {
  id: string;
  userName: string;
  votes: number;
  title: string;
  body: string;
}

// Define the shape of the context value
interface OpinionsContextType {
  opinions: Opinion[] | null;
  addOpinion: (opinion: Omit<Opinion, 'id' | 'votes'>) => Promise<void>;
  upvoteOpinion: (id: string) => Promise<void>;
  downvoteOpinion: (id: string) => Promise<void>;
}

// Create the context with a default value
export const OpinionsContext = createContext<OpinionsContextType>({
  opinions: null,
  addOpinion: async () => {},
  upvoteOpinion: async () => {},
  downvoteOpinion: async () => {},
});

// Define the props for the provider component
interface OpinionsContextProviderProps {
  children: ReactNode;
}

export function OpinionsContextProvider({ children }: OpinionsContextProviderProps) {
  const [opinions, setOpinions] = useState<Opinion[] | null>(null);

  useEffect(() => {
    async function loadOpinions() {
      try {
        const response = await fetch('http://localhost:3000/opinions');
        const opinions: Opinion[] = await response.json();
        setOpinions(opinions);
      } catch (error) {
        console.error('Failed to fetch opinions:', error);
      }
    }

    loadOpinions();
  }, []);

  async function addOpinion(enteredOpinionData: Omit<Opinion, 'id' | 'votes'>) {
    try {
      const response = await fetch('http://localhost:3000/opinions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enteredOpinionData),
      });

      if (!response.ok) {
        throw new Error('Failed to add opinion');
      }

      const savedOpinion: Opinion = await response.json();
      setOpinions((prevOpinions) => (prevOpinions ? [savedOpinion, ...prevOpinions] : [savedOpinion]));
    } catch (error) {
      console.error('Failed to add opinion:', error);
    }
  }

  async function upvoteOpinion(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/opinions/${id}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upvote opinion');
      }

      setOpinions((prevOpinions) =>
        prevOpinions
          ? prevOpinions.map((opinion) =>
              opinion.id === id ? { ...opinion, votes: opinion.votes + 1 } : opinion
            )
          : null
      );
    } catch (error) {
      console.error('Failed to upvote opinion:', error);
    }
  }

  async function downvoteOpinion(id: string) {
    try {
      const response = await fetch(`http://localhost:3000/opinions/${id}/downvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to downvote opinion');
      }

      setOpinions((prevOpinions) =>
        prevOpinions
          ? prevOpinions.map((opinion) =>
              opinion.id === id ? { ...opinion, votes: opinion.votes - 1 } : opinion
            )
          : null
      );
    } catch (error) {
      console.error('Failed to downvote opinion:', error);
    }
  }

  const contextValue: OpinionsContextType = {
    opinions,
    addOpinion,
    upvoteOpinion,
    downvoteOpinion,
  };

  return <OpinionsContext.Provider value={contextValue}>{children}</OpinionsContext.Provider>;
}
