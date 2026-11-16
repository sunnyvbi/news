import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import WritingPage from "@/pages/WritingPage";
import NewsPage from "@/pages/NewsPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import SearchPage from "@/pages/SearchPage";
import SavedPage from "@/pages/SavedPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 60 * 1000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen flex flex-col bg-paper text-ink font-body">
        <Loader />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/writing" element={<WritingPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
