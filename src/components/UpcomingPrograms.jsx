import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Star, Users, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const programs = [
  {
    id: 1,
    title: "Impact Bayelsa Prayer Rally",
    date: "Every Saturday",
    time: "6:30 AM WAT",
    description: "Join thousands in powerful intercession for our region",
    featured: true,
    attendees: "2.5K+",
    category: "Prayer",
    gradient: "from-purple-600 to-blue-600"
  },
  {
    id: 2,
    title: "Healing School Live",
    date: "Monday - Friday",
    time: "4:00 PM WAT", 
    description: "Experience divine healing and miraculous testimonies",
    featured: false,
    attendees: "15K+",
    category: "Healing",
    gradient: "from-emerald-600 to-teal-600"
  },
  {
    id: 3,
    title: "Global Prayer Network",
    date: "Daily",
    time: "Multiple Times",
    description: "24/7 prayer covering every continent and nation",
    featured: true,
    attendees: "50K+",
    category: "Prayer",
    gradient: "from-orange-600 to-red-600"
  },
  {
    id: 4,
    title: "Youth Church Online",
    date: "Sundays",
    time: "12:00 PM WAT",
    description: "Vibrant worship and life-changing messages for youth",
    featured: false,
    attendees: "8K+",
    category: "Youth",
    gradient: "from-pink-600 to-violet-600"
  }
];

export function UpcomingPrograms() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % programs.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % programs.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + programs.length) % programs.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const currentProgram = programs[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          Upcoming Programs
        </h2>
        <p className="text-white/70">
          Don't miss these life-changing events
        </p>
      </div>

      <div className="relative">
        {/* Main Featured Card */}
        <Card className="relative overflow-hidden border-0 shadow-2xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${currentProgram.gradient} opacity-90`} />
          <div className="absolute inset-0 bg-black/20" />
          
          <div className="relative z-10 p-8 text-white">
            <div className="flex items-start justify-between mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {currentProgram.category}
                  </Badge>
                  {currentProgram.featured && (
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-0">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <h3 className="text-2xl font-bold">{currentProgram.title}</h3>
                <p className="text-white/80 text-sm max-w-md">
                  {currentProgram.description}
                </p>
              </div>
              
              <div className="text-right space-y-1">
                <div className="flex items-center gap-1 text-white/90">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentProgram.attendees}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{currentProgram.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{currentProgram.time}</span>
              </div>
            </div>

            <Button className="bg-white text-gray-900 hover:bg-white/90 font-semibold">
              Join Program
            </Button>
          </div>
        </Card>

        {/* Navigation Buttons */}
        <Button
          onClick={prevSlide}
          variant="outline"
          size="sm"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={nextSlide}
          variant="outline"
          size="sm"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2">
        {programs.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Quick Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.slice(0, 3).map((program, index) => (
          <Card 
            key={program.id}
            className={`p-4 cursor-pointer transition-all duration-300 border-0 ${
              index === currentIndex % 3
                ? 'bg-white/20 backdrop-blur-sm shadow-lg scale-105'
                : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
            }`}
            onClick={() => goToSlide(index)}
          >
            <div className="text-white space-y-2">
              <h4 className="font-semibold text-sm">{program.title}</h4>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Calendar className="w-3 h-3" />
                <span>{program.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Clock className="w-3 h-3" />
                <span>{program.time}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}