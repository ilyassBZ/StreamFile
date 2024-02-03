import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Home />
      </div>
    </QueryClientProvider>
  );
}

export default App;
