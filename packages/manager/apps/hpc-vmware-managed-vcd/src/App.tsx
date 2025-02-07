import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { odsSetup } from '@ovhcloud/ods-common-core';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { Routes } from './routes/routes';
import { MessageContextProvider } from './context/Message.context';

odsSetup();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

function App() {
  const router = createHashRouter(Routes);

  return (
    <QueryClientProvider client={queryClient}>
      <MessageContextProvider>
        <RouterProvider router={router} />
      </MessageContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
