import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Sandbox() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <h1 className="font-display font-bold text-4xl mb-4 text-text-primary">Sandbox</h1>
        <p className="text-text-secondary">Secure n8n instances, rented by the hour. Coming soon.</p>
      </main>
      <Footer />
    </div>
  );
}
