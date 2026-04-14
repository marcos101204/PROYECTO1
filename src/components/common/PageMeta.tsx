import { HelmetProvider } from "react-helmet-async";

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};
