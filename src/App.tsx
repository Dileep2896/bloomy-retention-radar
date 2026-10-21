import { NavLink, Link, useLocation } from 'react-router-dom';
import { Radar, Users, ArrowUpRight, BookOpen, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { AppRoutes } from './routes';
import { Button } from './components/ui/button';
export function App() {
  const location = useLocation();
  const story = location.pathname === '/story';
  const [menu, setMenu] = useState(false);
  const roster = location.search.includes('students');
  return (
    <div className={story ? 'story-layout' : 'app-layout'}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!story && (
        <>
          <aside className={`sidebar ${menu ? 'mobile-open' : ''}`}>
            <Link className="brand" to="/radar" onClick={() => setMenu(false)}>
              <span className="brand-mark">
                <Radar size={20} />
              </span>
              Retention Radar
            </Link>
            <div className="school-switch">
              <div className="school-icon">
                <BookOpen size={18} />
              </div>
              <div>
                <strong>Kennedy Middle</strong>
                <small>Teacher workspace</small>
              </div>
            </div>
            <div className="nav-caption">YOUR CLASSROOM</div>
            <nav aria-label="Main navigation">
              <NavLink
                to="/radar"
                end
                className={() =>
                  `nav-link ${!roster && location.pathname === '/radar' ? 'active' : ''}`
                }
                onClick={() => setMenu(false)}
              >
                <Radar size={18} />
                Retention Radar<span className="nav-new">NEW</span>
              </NavLink>
              <Link
                to="/radar?view=students"
                className={`nav-link ${roster ? 'active' : ''}`}
                onClick={() => setMenu(false)}
              >
                <Users size={18} />
                Class roster
              </Link>
            </nav>
            <div className="sidebar-note">
                            <h3>Learning that lasts.</h3>
              <p>
                A little review today.
                <br />A stronger foundation tomorrow.
              </p>
              <Link to="/story">
                The story behind Radar
                <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="sidebar-bottom">
              <div className="teacher-avatar">MR</div>
              <div>
                <strong>Ms. Rivera</strong>
                <small>Grade 7 ELA</small>
              </div>
              <span className="teacher-status" title="Demo teacher" />
            </div>
          </aside>
          {menu && (
            <button
              className="mobile-scrim"
              aria-label="Close navigation"
              onClick={() => setMenu(false)}
            />
          )}
          <div className="workspace">
            <header className="topbar">
              <div className="topbar-left">
                <Button
                  variant="ghost"
                  size="icon"
                  className="mobile-menu"
                  aria-label={menu ? 'Close navigation' : 'Open navigation'}
                  onClick={() => setMenu((v) => !v)}
                >
                  {menu ? <X size={20} /> : <Menu size={20} />}
                </Button>
                <span>My classroom</span>
                <span className="breadcrumb-slash">/</span>
                <strong>Period 3</strong>
                <ChevronDown size={13} />
              </div>
              <div className="topbar-right">
                <span className="demo-indicator">Demo classroom</span>
                <span>Wed, Oct 21, 2026</span>
              </div>
            </header>
            <main id="main">
              <AppRoutes />
            </main>
            <footer className="app-footer">
              <span>Thoughtfully built for learning that lasts.</span>
              <span>
                Synthetic data · <Link to="/story">Built with Codex, verified by Claude Code ↗</Link>
              </span>
            </footer>
          </div>
        </>
      )}
      {story && (
        <main id="main">
          <AppRoutes />
        </main>
      )}
    </div>
  );
}
