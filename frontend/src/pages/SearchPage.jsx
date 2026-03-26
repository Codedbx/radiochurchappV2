import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { usePlayerStore } from "../stores/playerStore";
import { useAuthStore } from "../stores/authStore";
import { useAppStore } from "../stores/appStore";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const { isLoggedIn } = useAuthStore();
  const { setCurrentMessage } = usePlayerStore();
  const { openAuthModal } = useAppStore();

  useEffect(() => {
    if (query) {
      const filtered = messages.filter(msg =>
        msg.title.toLowerCase().includes(query.toLowerCase()) ||
        msg.speaker.toLowerCase().includes(query.toLowerCase()) ||
        msg.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handlePlay = (message) => {
    if (!isLoggedIn) {
      openAuthModal("login");
      return;
    }
    setCurrentMessage(message);
  };

  if (!query) {
    return <div className="text-center py-12">Enter a search term to find messages.</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>
      {results.length === 0 ? (
        <p className="text-muted-foreground">No messages found.</p>
      ) : (
        results.map(msg => (
          <Card key={msg.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{msg.title}</h3>
                <p className="text-sm text-muted-foreground">{msg.speaker} • {msg.category}</p>
                <p className="text-xs text-muted-foreground mt-1">{msg.date}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handlePlay(msg)}>
                <Play className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}