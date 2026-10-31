import type { Metadata } from 'next';
import './globals.css';
import VengenceBackground from '@/components/ui/VengenceBackground';

export const metadata: Metadata = {
  title: 'InfraTwin AI • Autonomous Road Infrastructure Auditing Platform',
  description: 'AI-powered road infrastructure auditing, 3D depth spatial twin, BOQ generation, and contractor SLA fraud detection for Indian smart cities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#dbe3eb] text-slate-800 font-sans antialiased relative selection:bg-cyan-600 selection:text-white">
        <VengenceBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
