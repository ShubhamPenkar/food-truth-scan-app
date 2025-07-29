import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Flame, Star, Medal, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface UserStats {
  points: number;
  level: number;
  streak: number;
  scansToday: number;
  totalScans: number;
  healthyChoices: number;
  badges: string[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (stats: UserStats) => boolean;
  points: number;
}

const badges: Badge[] = [
  {
    id: 'first_scan',
    name: 'First Scan',
    description: 'Scanned your first product',
    icon: '🔍',
    requirement: (stats) => stats.totalScans >= 1,
    points: 10
  },
  {
    id: 'health_hero',
    name: 'Health Hero',
    description: 'Made 10 healthy choices',
    icon: '🦸',
    requirement: (stats) => stats.healthyChoices >= 10,
    points: 50
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintained a 7-day scanning streak',
    icon: '🔥',
    requirement: (stats) => stats.streak >= 7,
    points: 75
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Scanned 100 products',
    icon: '💯',
    requirement: (stats) => stats.totalScans >= 100,
    points: 100
  },
  {
    id: 'daily_champion',
    name: 'Daily Champion',
    description: 'Scanned 10 products in one day',
    icon: '⭐',
    requirement: (stats) => stats.scansToday >= 10,
    points: 25
  }
];

export const GamificationSystem = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('foodScanStats');
    return saved ? JSON.parse(saved) : {
      points: 0,
      level: 1,
      streak: 0,
      scansToday: 0,
      totalScans: 0,
      healthyChoices: 0,
      badges: []
    };
  });

  const [showNewBadge, setShowNewBadge] = useState<Badge | null>(null);

  useEffect(() => {
    localStorage.setItem('foodScanStats', JSON.stringify(stats));
  }, [stats]);

  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  const getPointsForNextLevel = (level: number) => {
    return level * 100;
  };

  const addScanPoints = (healthScore: number) => {
    const basePoints = 5;
    const healthBonus = healthScore > 70 ? 10 : healthScore > 50 ? 5 : 0;
    const streakBonus = Math.min(stats.streak, 10);
    
    const totalPoints = basePoints + healthBonus + streakBonus;
    
    setStats(prev => {
      const newStats = {
        ...prev,
        points: prev.points + totalPoints,
        totalScans: prev.totalScans + 1,
        scansToday: prev.scansToday + 1,
        healthyChoices: healthScore > 70 ? prev.healthyChoices + 1 : prev.healthyChoices,
        streak: prev.streak + 1
      };
      
      newStats.level = calculateLevel(newStats.points);
      
      // Check for new badges
      badges.forEach(badge => {
        if (!prev.badges.includes(badge.id) && badge.requirement(newStats)) {
          newStats.badges.push(badge.id);
          newStats.points += badge.points;
          setShowNewBadge(badge);
          toast.success(`🎉 New badge earned: ${badge.name}!`);
        }
      });
      
      return newStats;
    });
    
    toast.success(`+${totalPoints} points earned!`);
  };

  const earnedBadges = badges.filter(badge => stats.badges.includes(badge.id));
  const availableBadges = badges.filter(badge => !stats.badges.includes(badge.id));
  
  const currentLevelProgress = stats.points % 100;
  const nextLevelPoints = getPointsForNextLevel(stats.level);

  return (
    <div className="space-y-4">
      {/* Level & Progress */}
      <Card className="p-4 bg-gradient-primary/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Level {stats.level}</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            {stats.points} points
          </div>
        </div>
        
        <Progress value={currentLevelProgress} className="h-2 mb-2" />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{currentLevelProgress}/100 to next level</span>
          <span>Level {stats.level + 1}</span>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-bold text-lg">{stats.streak}</span>
          </div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-lg">{stats.scansToday}</span>
          </div>
          <div className="text-xs text-muted-foreground">Today's Scans</div>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 text-green-500" />
            <span className="font-bold text-lg">{stats.healthyChoices}</span>
          </div>
          <div className="text-xs text-muted-foreground">Healthy Choices</div>
        </Card>
        
        <Card className="p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-lg">{stats.totalScans}</span>
          </div>
          <div className="text-xs text-muted-foreground">Total Scans</div>
        </Card>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Earned Badges ({earnedBadges.length})
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="text-center p-2 bg-primary/5 rounded-lg">
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Next Badges to Earn</h4>
          <div className="space-y-2">
            {availableBadges.slice(0, 3).map(badge => (
              <div key={badge.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                <div className="text-xl opacity-50">{badge.icon}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{badge.name}</div>
                  <div className="text-xs text-muted-foreground">{badge.description}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  +{badge.points}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Test Button for Demo */}
      <Button
        onClick={() => addScanPoints(Math.floor(Math.random() * 100))}
        variant="outline"
        className="w-full"
      >
        🎮 Demo: Add Random Scan Points
      </Button>

      {/* New Badge Modal */}
      {showNewBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 text-center max-w-sm w-full bg-gradient-primary text-primary-foreground">
            <div className="text-6xl mb-4">{showNewBadge.icon}</div>
            <h3 className="text-xl font-bold mb-2">New Badge Earned!</h3>
            <h4 className="text-lg mb-2">{showNewBadge.name}</h4>
            <p className="text-sm mb-4 opacity-90">{showNewBadge.description}</p>
            <Badge className="mb-4">+{showNewBadge.points} points</Badge>
            <Button
              onClick={() => setShowNewBadge(null)}
              variant="secondary"
              className="w-full"
            >
              Awesome!
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};