import serve from 'https://deno.land/x/drollup_plugin_serve/mod.ts'
import live from '../src/index.ts'

export default {
  input: 'entry.js',
  output: {
    file: 'dest.js',
    format: 'cjs',
  },
  plugins: [
    serve({ port: Math.round(Math.random() * 10000) + 40000 }),
    live(),
  ],
}
