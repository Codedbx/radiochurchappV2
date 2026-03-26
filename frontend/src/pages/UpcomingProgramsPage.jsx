import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { motion } from "framer-motion"

const UPCOMING_PROGRAMS = [
  {
    id: 1,
    title: "Sunday Service",
    speaker: "Pastor John",
    date: "Mar 17, 2024",
    time: "9:00 AM - 11:30 AM",
    location: "Main Sanctuary",
    category: "Service",
    attendees: 500,
    description: "Join us for our weekly worship service with powerful preaching and music ministry.",
  },
  {
    id: 2,
    title: "Midweek Communion",
    speaker: "Pastor Mary",
    date: "Mar 20, 2024",
    time: "7:00 PM - 8:30 PM",
    location: "Fellowship Hall",
    category: "Service",
    attendees: 250,
    description: "A time of prayer, worship, and breaking of bread together.",
  },
  {
    id: 3,
    title: "Prayer Vigil",
    speaker: "Pastor Chris",
    date: "Mar 24, 2024",
    time: "10:00 PM - 6:00 AM",
    location: "Prayer Chamber",
    category: "Prayer",
    attendees: 150,
    description: "All-night prayer session focusing on intercession and spiritual warfare.",
  },
  {
    id: 4,
    title: "Youth Fellowship",
    speaker: "Pastor Sarah",
    date: "Mar 23, 2024",
    time: "4:00 PM - 6:00 PM",
    location: "Youth Center",
    category: "Fellowship",
    attendees: 200,
    description: "Interactive session for young adults with games, discussions, and refreshments.",
  },
  {
    id: 5,
    title: "Women's Conference",
    speaker: "Guest Speaker",
    date: "Mar 30 - Apr 1, 2024",
    time: "All Day",
    location: "Convention Center",
    category: "Conference",
    attendees: 1000,
    description: "Three-day conference featuring workshops, prayer sessions, and networking.",
  },
]

const CATEGORY_COLORS = {
  Service: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Prayer: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Fellowship: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  Conference: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
}

export default function UpcomingProgramsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upcoming Programs</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Stay updated with our upcoming services, events, and programs
        </p>
      </motion.div>

      {/* Programs Grid */}
      <motion.div variants={containerVariants} className="space-y-4">
        {UPCOMING_PROGRAMS.map((program) => (
          <motion.div
            key={program.id}
            variants={itemVariants}
            className="p-6 bg-white dark:bg-slate-800/70 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-violet-200 dark:hover:border-violet-800/50 transition-all overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {program.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`${CATEGORY_COLORS[program.category] || "bg-slate-100 dark:bg-slate-700"}`}
                  >
                    {program.category}
                  </Badge>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {program.description}
                </p>
              </div>
            </div>

            {/* Program Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Date</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {program.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Time</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {program.time}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Location</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {program.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-violet-600 dark:text-violet-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500">Expected</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {program.attendees}+ attendees
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Speaker: <span className="font-medium text-slate-900 dark:text-white">{program.speaker}</span>
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                >
                  Learn More
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  Register
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
