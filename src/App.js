import { useState, useEffect } from "react";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import ChatApp from "@/components/ChatApp";

function App() {
  return (
    <div className="App">
      <ChatApp />
      <Toaster />
    </div>
  );
}

export default App;