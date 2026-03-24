import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            borderRadius: '8px',
          },
          success: {
            style: {
              background: '#059669', // Tailwind green-600
            },
          },
          error: {
            style: {
              background: '#DC2626', // Tailwind red-600
            },
          },
        }}
      />
      <AppRoutes />
    </>
  );
}

export default App;
