import { NavLink } from 'react-router-dom';

export default function Footer() {
  const links = {
    Product: [
      { name: 'Marketplace', path: '/marketplace' },
      { name: 'Sandbox', path: '/sandbox' },
      { name: 'Hosting', path: '/hosting' },
      { name: 'Learn', path: '/learn' },
    ],
    Company: [
      { name: 'About', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Changelog', path: '/changelog' },
    ],
    Legal: [
      { name: 'Privacy', path: '/privacy' },
      { name: 'Terms', path: '/terms' },
    ],
    Connect: [
      { name: 'Twitter/X', path: '#' },
      { name: 'GitHub', path: '#' },
      { name: 'Discord', path: '#' },
    ],
  };

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex flex-col md:flex-row justify-between w-full">
        {/* Left Column */}
        <div className="mb-12 md:mb-0 max-w-sm">
          <NavLink to="/" className="flex items-center space-x-0 mb-4 inline-block">
            <span className="font-sans font-medium text-text-secondary text-xl">n8n</span>
            <span className="font-display font-extrabold text-primary text-xl">Galaxy</span>
          </NavLink>
          <p className="font-sans font-normal text-[14px] text-text-tertiary mb-6">
            The n8n ecosystem hub
          </p>
          <p className="font-sans font-normal text-[14px] text-text-tertiary">
            © 2026 n8nGalaxy. All rights reserved.
          </p>
        </div>

        {/* Right Column - Links */}
        <div className="flex-1 max-w-[800px] grid grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-sans font-medium text-[14px] text-text-primary mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      className="font-sans font-normal text-[14px] text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
