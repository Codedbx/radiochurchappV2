import { RadioPlayer } from '@/components/RadioPlayer';
import { ServiceSchedule } from '@/components/ServiceSchedule';
import { PhoneSection } from '@/components/PhoneSection';
import { ServiceButtons } from '@/components/ServiceButtons';
import { CommentSection } from '@/components/CommentSection';
import { ChatWidget } from '@/components/ChatWidget';
import { UpcomingPrograms } from '@/components/UpcomingPrograms';
import CommentButton from './components/CommentButton';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <h1 className="text-2xl md:text-6xl font-bold text-white">
              Christ Embassy Nigeria
            </h1>
            <p className="text-white/80 text-lg">
              South South Zone 1 - Online Radio Church
            </p>
            <p className="text-white/60 text-sm">
              Broadcasting the Light of God's Word to the Nations
            </p>
          </div>

          {/* Featured Radio Player */}
          <div className="max-w-2xl mx-auto">
            <RadioPlayer />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">

        {/* Services Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 mb-16">
          {/* Left Side - Service Info */}
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
              <ServiceSchedule />
              <PhoneSection />
            </div>
          </div>


          {/* Right Side - Service Actions */}
          <div className="xl:col-span-3 sticky top-4 self-start">
            <ServiceButtons />
          </div>
        </div>

        {/* Upcoming Programs Section */}
        <div className="mb-16">
          <UpcomingPrograms />
        </div>

        {/* Community Section */}
        <div className="max-w-4xl mx-auto">
          <CommentSection />
        </div>
        
        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <a 
            href="#" 
            className="text-white/60 hover:text-white underline text-sm transition-colors duration-300"
          >
            Privacy Policy
          </a>
        </footer>
      </div>

      {/* Chat Widget */}
      {/* <ChatWidget /> */}

      {/* Comment button */}
      <CommentButton />
    </div>
  );
};

export default App;
