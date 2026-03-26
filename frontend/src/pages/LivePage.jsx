export default function LivePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="relative w-40 h-40 mb-6">
        <div className="absolute inset-0 bg-violet-500/20 rounded-full animate-pulse" />
        <img src="/images/logo.png" alt="Live Stream" className="relative w-full h-full object-contain" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Live Stream</h2>
      <p className="text-muted-foreground">Tune in to our live radio broadcast</p>
      <p className="text-sm text-muted-foreground mt-4">Use the player controls at the bottom to listen.</p>
    </div>
  );
}