import { Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ServiceSchedule() {
  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Live Radio Services
        </h3>
        <p className="text-gray-600 text-sm">
          Join us for powerful worship and the Word
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="relative overflow-hidden p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100">
          <div className="absolute top-2 right-2 w-2 h-2 bg-service-red rounded-full animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Sundays</p>
              <p className="font-bold text-service-red text-lg">7:00 - 8:00 AM</p>
              <p className="text-xs text-gray-500">West Africa Time</p>
            </div>
          </div>
        </div>
        
        <div className="relative overflow-hidden p-4 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl border border-emerald-100">
          <div className="absolute top-2 right-2 w-2 h-2 bg-service-red rounded-full animate-pulse"></div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-secondary rounded-xl">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Wednesdays</p>
              <p className="font-bold text-service-red text-lg">6:00 - 7:00 PM</p>
              <p className="text-xs text-gray-500">West Africa Time</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}