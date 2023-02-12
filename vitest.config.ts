/// <reference types="vitest" />
import { defineConfig } from 'vite'
import {config} from "dotenv";
config();

export default defineConfig({
  test: {
    alias: {
        '@/': `${__dirname}/src/`,
    },
    watch: false,
  },
})