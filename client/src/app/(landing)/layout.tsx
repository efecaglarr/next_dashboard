import "./globals.css";
import "./App.css"; // Landing'e özel CSS

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
