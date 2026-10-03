import { useEffect } from "react";
import Header from "./components/Header";
import { seedExamplesOnce, useRoute } from "./lib/hooks";
import HistoryPage from "./pages/HistoryPage";
import ProgressPage from "./pages/ProgressPage";
import WritePage from "./pages/WritePage";

export default function App() {
  const route = useRoute();

  useEffect(() => {
    seedExamplesOnce();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.page]);

  return (
    <div className="shell">
      <Header current={route.page} />
      <main>
        {route.page === "write" && <WritePage />}
        {route.page === "history" && <HistoryPage id={route.id} />}
        {route.page === "progress" && <ProgressPage />}
      </main>
      <footer className="site-footer">
        <span>Growth Mirror · a weekly reflection journal</span>
        <a href="https://portfolio-anu-sirkas-projects.vercel.app">Made by Anu Sirkas</a>
      </footer>
    </div>
  );
}
