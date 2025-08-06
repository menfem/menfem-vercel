// Global type declarations for external libraries and APIs

declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      parameters?: Record<string, unknown>
    ) => void;
  }
}

export {};