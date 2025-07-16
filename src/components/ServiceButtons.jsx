import { Link, Star, Book, Globe, GraduationCap, Tv, MessageSquare, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceButtons() {
  const services = [
    {
      title: "Join the Impact Bayelsa Online Prayer Rally every Saturday 6:30am WAT",
      color: "bg-service-cyan hover:bg-service-cyan/90",
      icon: Star,
      link: "#"
    },
    {
      title: "Join the Pastor Chris Live Prayer Network (Pray-A-Thon)",
      color: "bg-service-blue hover:bg-service-blue/90",
      icon: Link,
      link: "#"
    },
    {
      title: "Rhapsody of Realities (Read and Earn)",
      color: "bg-service-magenta hover:bg-service-magenta/90",
      icon: Book,
      link: "#"
    },
    {
      title: "Reachout World with Rhapsody Of Realities",
      color: "bg-service-cyan hover:bg-service-cyan/90",
      icon: Globe,
      link: "#"
    },
    {
      title: "Healing School",
      color: "bg-service-orange hover:bg-service-orange/90",
      icon: GraduationCap,
      link: "#"
    },
    {
      title: "Healing Streams TV",
      color: "bg-service-yellow hover:bg-service-yellow/90",
      icon: Tv,
      link: "#"
    },
    {
      title: "Listen to exciting Messages by Pastor Chris",
      color: "bg-service-red hover:bg-service-red/90",
      icon: MessageSquare,
      link: "#"
    },
    {
      title: "Unending Praise 24/7",
      color: "bg-service-blue hover:bg-service-blue/90",
      icon: Music,
      link: "#"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">
          Quick Access
        </h3>
        <p className="text-white/70 text-sm">
          Connect with our ministry platforms
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <Button
            key={index}
            asChild
            className={`${service.color} text-white font-medium py-6 px-6 rounded-2xl text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border-0 group relative overflow-hidden`}
          >
            <a href={service.link} className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                <service.icon className="w-5 h-5" />
              </div>
              <span className="text-left flex-1 leading-tight whitespace-break-spaces">{service.title}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}