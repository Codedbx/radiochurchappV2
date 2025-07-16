import { Phone, Heart, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function PhoneSection() {
  const phoneNumber = "+2347042066472";
  
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  return (
    <Card className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/20">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Get Connected
        </h3>
        <p className="text-gray-600 text-sm">
          Reach out for prayer and support
        </p>
      </div>
      
      <div className="space-y-4">
        <Button 
          onClick={handleCall}
          className="w-full bg-gradient-to-r from-phone-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">Call Now</p>
              <p className="font-bold">{phoneNumber}</p>
            </div>
          </div>
        </Button>
        
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl text-center border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-service-red" />
            <p className="text-sm font-semibold text-gray-700">
              Support Ministry
            </p>
          </div>
          <p className="text-xs text-gray-600 mb-2">
            To give, kindly text "GIVE" to
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
            <MessageSquare className="w-3 h-3 text-primary" />
            <span className="font-bold text-primary">{phoneNumber}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}