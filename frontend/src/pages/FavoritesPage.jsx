"use client";
import { useFavoritesStore } from "../stores/favoritesStore";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoritesStore();

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Heart className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
        <p className="text-slate-500 mb-4">Browse messages and save your favorites to see them here.</p>
        <Button asChild className="bg-gradient-to-r from-violet-600 to-purple-600">
          <a href="/messages">Browse Messages</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Favorites</h2>
      <div className="space-y-4">
        {favorites.map((fav) => (
          <Card key={fav.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{fav.title || `Message #${fav.id}`}</h3>
                <p className="text-sm text-muted-foreground mt-1">{fav.category || "General"}</p>
                {fav.date && <p className="text-xs text-muted-foreground mt-2">{fav.date}</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFavorite(fav.id)}
                className="text-rose-600 hover:text-rose-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}