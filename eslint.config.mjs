/**
 * ESLint Configuration
 * 
 * This file configures ESLint for the EduAI application to ensure code quality
 * and consistency across the codebase. It extends Next.js recommended rules
 * and provides custom configurations for TypeScript and React.
 */

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert ES module URL to file path for __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create compatibility layer for ESLint flat config
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: { extends: ['eslint:recommended'] },
  allConfig: { extends: ['eslint:all'] },
});

// Export ESLint configuration array
export default [
  // Extend Next.js recommended ESLint configuration
  ...compat.extends('next/core-web-vitals'),
];
