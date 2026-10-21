import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RadarPage } from './pages/RadarPage';
import { StudentPage } from './pages/StudentPage';
const StoryPage = lazy(() => import('./pages/StoryPage'));
export function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="loading-state" role="status">
          Opening the story…
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/radar" replace />} />
        <Route path="/radar" element={<RadarPage />} />
        <Route path="/radar/student/:id" element={<StudentPage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route
          path="*"
          element={
            <div className="empty-state">
              <h1>Page not found</h1>
              <Link to="/radar">Back to Radar</Link>
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
}
