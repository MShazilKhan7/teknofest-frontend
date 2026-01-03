import { ThemeProvider } from 'next-themes';
import { TicketProvider } from '@/context/TicketContext';
import { Dashboard } from '@/components/Dashboard';

const Index = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TicketProvider>
        <Dashboard />
      </TicketProvider>
    </ThemeProvider>
  );
};

export default Index;
