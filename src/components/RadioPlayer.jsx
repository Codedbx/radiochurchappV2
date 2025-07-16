import { useState } from 'react';
import { Play, Pause, Volume2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 text-white p-8 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl">
        <div className="text-center">
            <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-primary p-4 rounded-full">
                    {/* <Radio className="w-8 h-8 text-white" /> */}
                    <img src="/images/logo.png" className='h-32 w-44' alt="logo" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-service-red rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                ONLINE RADIO CHURCH
            </h2>
            <p className="text-gray-300 text-sm mb-1">
                with PASTOR OBI UMEASIEGBU
            </p>
            <p className="text-primary text-xs font-semibold">
                THE LIGHT OF BAYELSA
            </p>
        </div>

        <div className="space-y-6">
            <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Christ Embassy Nigeria South South Zone 1</p>
            </div>

            <div className="bg-muted/50 rounded-full px-4 py-3 flex items-center gap-4 min-w-[400px] shadow-sm">
                {/* Play/Pause Button */}
                <Button 
                    onClick={togglePlay}
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 hover:bg-muted"
                >
                    {isPlaying ? (
                    <Pause className="w-4 h-4" />
                    ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                    )}
                </Button>

                {/* Time Display */}
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Progress Bar */}
                <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div 
                    className="h-full bg-foreground rounded-full transition-all duration-300" 
                    style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
                    />
                </div>

                {/* Volume Button */}
                <Button 
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 hover:bg-muted"
                >
                    <Volume2 className="w-4 h-4" />
                </Button>

                {/* More Options */}
                <Button 
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 hover:bg-muted"
                >
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    </Card>
  );
}