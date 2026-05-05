import { useState, useCallback, useRef, useEffect } from 'react';
import type { Zombie, ZombieType, ZombieGameState } from '../types/zombie';
import { playSound } from '../utils/sound';

type HookState = ZombieGameState & {
  zombiesKilled: number;
  isGameOver: boolean;
  roundComplete: boolean;
  currentIndex: number;
  maxCombo: number;
  roundsCompleted: number;
};

type UseZombieGame = {
  state: HookState;
  currentChar: string;
  currentText: string;
  initializeGame: () => void;
  startGame: () => void;
  resetGame: () => void;
  continueGame: () => void;
  defenseLineX: number;
};

const SPAWN_INTERVAL_MS = 2000;
const DEFENSE_LINE_X = 50;
const SPAWN_START_X = 720;
const MAX_COMBO = 99;
const COMBO_THRESHOLD = 5;

const TEXT_POOL = [
  'the quick brown fox jumps over the lazy dog',
  'a journey of a thousand miles begins with a single step',
  'practice makes perfect in everything we do',
  'all that glitters is not gold',
  'actions speak louder than words',
  'beauty is in the eye of the beholder',
  'birds of a feather flock together',
  'every cloud has a silver lining',
  'fortune favors the bold',
  'great things never come from comfort zones',
  'happiness is a choice not a result',
  'if you can dream it you can do it',
  'keep calm and carry on',
  'life is what happens when you are busy making plans',
  'make each day your masterpiece',
  'no pain no gain',
  'opportunity knocks but once',
  'patience is the key to paradise',
  'quality is better than quantity',
  'reading is to the mind what exercise is to the body',
];

function getRandomText(): string {
  return TEXT_POOL[Math.floor(Math.random() * TEXT_POOL.length)];
}

const ZOMBIE_CONFIGS: Record<ZombieType, { speed: number; health: number }> = {
  normal: { speed: 30, health: 1 },
  fast: { speed: 45, health: 1 },
  strong: { speed: 24, health: 3 },
};

function getZombieType(roundsCompleted: number): ZombieType {
  const rand = Math.random();
  
  if (roundsCompleted < 2) return 'normal';
  
  if (roundsCompleted < 4) {
    return rand < 0.8 ? 'normal' : 'fast';
  }
  
  if (rand < 0.5) return 'normal';
  if (rand < 0.8) return 'fast';
  return 'strong';
}

function generateZombieId(): string {
  return `zombie-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function useZombieGame(): UseZombieGame {
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [zombiesKilled, setZombiesKilled] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [roundComplete, setRoundComplete] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>(getRandomText());
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const zombiesRef = useRef<Zombie[]>([]);
  const gameLoopCallbackRef = useRef<(timestamp: number) => void>(() => {});
  const roundsCompletedRef = useRef<number>(0);

  useEffect(() => {
    zombiesRef.current = zombies;
  }, [zombies]);

  useEffect(() => {
    roundsCompletedRef.current = roundsCompleted;
  }, [roundsCompleted]);

  const cleanupGameLoop = useCallback(() => {
    if (gameLoopRef.current !== null) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    lastTimeRef.current = 0;
  }, []);

  const cleanupSpawnInterval = useCallback(() => {
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!isPlayingRef.current) {
      return;
    }
    
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }
    
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;
    
    setZombies(prevZombies => {
      const updatedZombies: Zombie[] = [];
      let gameOver = false;
      
      for (const zombie of prevZombies) {
        const newX = zombie.position.x - zombie.speed * deltaTime;
        
        if (newX <= DEFENSE_LINE_X) {
          gameOver = true;
          break;
        }
        
        updatedZombies.push({
          ...zombie,
          position: { ...zombie.position, x: newX }
        });
      }
      
      if (gameOver) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setIsGameOver(true);
        cleanupGameLoop();
        return prevZombies;
      }
      
      return updatedZombies;
    });
    
    if (isPlayingRef.current) {
      gameLoopRef.current = requestAnimationFrame(gameLoopCallbackRef.current);
    }
  }, [cleanupGameLoop]);

  useEffect(() => {
    gameLoopCallbackRef.current = gameLoop;
  }, [gameLoop]);

  const findTargetZombie = useCallback((): Zombie | null => {
    if (zombiesRef.current.length === 0) return null;
    return zombiesRef.current.reduce((closest, zombie) => 
      zombie.position.x < closest.position.x ? zombie : closest
    );
  }, []);

  const damageZombie = useCallback((zombieId: string): void => {
    setZombies(prev => {
      const zombieIndex = prev.findIndex(z => z.id === zombieId);
      if (zombieIndex === -1) return prev;
      
      const zombie = prev[zombieIndex];
      const newHealth = zombie.health - 1;
      
      if (newHealth <= 0) {
        setZombiesKilled(k => k + 1);
        setScore(s => s + 10);
        return prev.filter(z => z.id !== zombieId);
      }
      
      const updated = [...prev];
      updated[zombieIndex] = { ...zombie, health: newHealth };
      return updated;
    });
  }, []);

  const damageMultipleZombies = useCallback((count: number): void => {
    setZombies(prev => {
      if (prev.length === 0) return prev;
      
      const sortedZombies = [...prev].sort((a, b) => a.position.x - b.position.x);
      const targets = sortedZombies.slice(0, count);
      
      let killedCount = 0;
      const remainingZombies = prev.filter(zombie => {
        const target = targets.find(t => t.id === zombie.id);
        if (!target) return true;
        
        const newHealth = zombie.health - 1;
        if (newHealth <= 0) {
          killedCount++;
          return false;
        }
        return true;
      });
      
      if (killedCount > 0) {
        setZombiesKilled(k => k + killedCount);
        setScore(s => s + 10 * killedCount);
      }
      
      return remainingZombies;
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isPlayingRef.current || isGameOver || roundComplete) return;
    
    const idx = currentIndex;
    if (idx >= currentText.length) return;
    
    const expectedChar = currentText[idx];
    
    if (event.key === expectedChar) {
      const willFinish = idx + 1 >= currentText.length;
      setCurrentIndex(prev => prev + 1);
      
      const newCombo = Math.min(combo + 1, MAX_COMBO);
      const isComboTrigger = newCombo >= COMBO_THRESHOLD && combo < COMBO_THRESHOLD;
      
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      
      if (isComboTrigger) {
        playSound('combo');
      }
      
      if (zombiesRef.current.length > 0) {
        if (newCombo >= COMBO_THRESHOLD) {
          damageMultipleZombies(3);
        } else {
          const targetZombie = findTargetZombie();
          if (targetZombie) {
            damageZombie(targetZombie.id);
          }
        }
      }
      
      if (willFinish) {
        isPlayingRef.current = false;
        setIsPlaying(false);
        setRoundComplete(true);
        setRoundsCompleted(prev => prev + 1);
      }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      setCombo(0);
    }
  }, [currentIndex, combo, isGameOver, roundComplete, currentText, findTargetZombie, damageZombie, damageMultipleZombies]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const spawnZombie = useCallback(() => {
    const type = getZombieType(roundsCompletedRef.current);
    const config = ZOMBIE_CONFIGS[type];
    
    const newZombie: Zombie = {
      id: generateZombieId(),
      type,
      position: { x: SPAWN_START_X, y: Math.random() * 400 + 50 },
      health: config.health,
      speed: config.speed,
    };
    
    setZombies(prev => [...prev, newZombie]);
  }, []);

  const initializeGame = useCallback((): void => {
    cleanupSpawnInterval();
    cleanupGameLoop();
    isPlayingRef.current = false;
    setZombies([]);
    setScore(0);
    setCombo(0);
    setZombiesKilled(0);
    setCurrentIndex(0);
    setMaxCombo(0);
    setIsPlaying(false);
    setIsGameOver(false);
    setRoundComplete(false);
    setCurrentText(getRandomText());
    setRoundsCompleted(0);
  }, [cleanupGameLoop, cleanupSpawnInterval]);

  const startGame = useCallback((): void => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    
    spawnZombie();
    spawnIntervalRef.current = setInterval(() => {
      spawnZombie();
    }, SPAWN_INTERVAL_MS);
    
    gameLoopRef.current = requestAnimationFrame(gameLoopCallbackRef.current);
  }, [spawnZombie]);

  const continueGame = useCallback((): void => {
    setRoundComplete(false);
    setCurrentIndex(0);
    setCurrentText(getRandomText());
    
    isPlayingRef.current = true;
    setIsPlaying(true);
    
    gameLoopRef.current = requestAnimationFrame(gameLoopCallbackRef.current);
  }, []);

  const resetGame = useCallback((): void => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
      if (gameLoopRef.current !== null) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const currentChar = currentText[currentIndex] || '';

  const state: HookState = {
    zombies,
    score,
    combo,
    isPlaying,
    zombiesKilled,
    isGameOver,
    roundComplete,
    currentIndex,
    maxCombo,
    roundsCompleted,
  };

  return {
    state,
    currentChar,
    currentText,
    initializeGame,
    startGame,
    resetGame,
    continueGame,
    defenseLineX: DEFENSE_LINE_X,
  };
}
