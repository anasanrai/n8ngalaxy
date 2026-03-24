import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Learn() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="font-display font-bold text-4xl mb-4 text-text-primary">Learn</h1>
        <p className="text-text-secondary">Master n8n with our expert guides and tutorials. Coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
