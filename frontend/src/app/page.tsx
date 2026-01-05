import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        {/* Background Grid or Effects could go here */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
      </div>

      <div className="z-10 w-full h-full">
        <Chat />
      </div>
    </main>
  );
}
