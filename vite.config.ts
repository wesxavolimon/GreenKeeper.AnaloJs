/// <reference types="vitest" />

import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// SPA estatica (sem SSR, sem rotas de servidor, sem backend proprio)
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      '@domain': resolve(import.meta.dirname, 'src/domain'),
      '@application': resolve(import.meta.dirname, 'src/application'),
      '@infrastructure': resolve(import.meta.dirname, 'src/infrastructure'),
      '@composition': resolve(import.meta.dirname, 'src/composition'),
      '@app': resolve(import.meta.dirname, 'src/app'),
    },
  },
  plugins: [
    analog({
      ssr: false,
      static: true,
      prerender: {
        routes: [],
      },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/main.ts',
        'src/test-setup.ts',
        'src/**/*.spec.ts',
        'src/**/*.d.ts',
      ],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
}));
