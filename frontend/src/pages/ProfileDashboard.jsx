"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Trash2, MessageCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "../stores/authStore"
import { useFavoritesStore } from "../stores/favoritesStore"
import { useAppStore } from "../stores/appStore"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function ProfileDashboard() {
  const { user } = useAuthStore()
  const { favorites, removeFavorite, clearFavorites } = useFavoritesStore()
  const { setCurrentPage } = useAppStore()

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900/10 py-12"
    >
      <div className="container max-w-7xl mx-auto px-6">
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="bg-white dark:bg-slate-800/70 border-0 shadow-xl">
            <CardHeader className="pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{user?.name}</CardTitle>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">{user?.email}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Member since {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-violet-200/50 dark:border-violet-800/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-violet-200 dark:bg-violet-900/40 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Favorites</p>
                    <p className="text-2xl font-bold text-violet-600">{favorites.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200/50 dark:border-blue-800/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-200 dark:bg-blue-900/40 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Comments</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-200 dark:bg-green-900/40 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Listening Time</p>
                    <p className="text-2xl font-bold text-green-600">0 hrs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Favorites Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-slate-800/70 border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/30 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <CardTitle>My Favorites</CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {favorites.length} saved {favorites.length === 1 ? "message" : "messages"}
                    </p>
                  </div>
                </div>
                {favorites.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFavorites}
                    className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <motion.div variants={itemVariants} className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">No favorites yet</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Browse messages and save your favorites to see them here.
                  </p>
                  <Button
                    onClick={() => setCurrentPage("messages")}
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    Browse Messages
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((favorite) => (
                    <motion.div
                      key={favorite.id}
                      variants={itemVariants}
                      className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {favorite.title || `Message #${favorite.id}`}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {favorite.category || "General"}
                        </p>
                        {favorite.date && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{favorite.date}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFavorite(favorite.id)}
                        className="ml-4 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
