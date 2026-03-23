import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          duration: 4000,
        }} 
      />
      <AppRoutes />
    </>
  );
}

export default App;
