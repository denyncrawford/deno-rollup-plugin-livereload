import { getFreePort } from 'https://deno.land/x/free_port@v1.2.0/mod.ts'
import LiveReload from 'https://deno.land/x/livereload@0.1.0/src/mod.ts'

class DLiveReload {
  options = {
    port: 39430,
    base: Deno.cwd(),
    recursive: true,
    serve: true,
    secure: false,
    verbose: true,
    clientUrl : ''
  }
  enabled: boolean;
  constructor(options: Array<string> | string | Record<string, string | number | Array<string> | boolean > = '.') {
    if (typeof options === 'string' || Array.isArray(options)) {
      options = { base: options };
    }
    Object.assign(this.options, options)
    this.enabled = this.options.verbose;
  }

  async init() {
    this.options.port = await getFreePort(this.options.port);
    new LiveReload(this.options).watch();
  }
}

export default (options: Array<string> | string | Record<string, string | number | Array<string> | boolean >) => {
  const live = new DLiveReload(options)
  live.init()
  return {
    name: 'livereload',
    banner() {
      const port = live.options.port
      const snippetSrc = live.options.clientUrl
        ? JSON.stringify(live.options.clientUrl)
        : Deno.env.get('CODESANDBOX_SSE')
        ? `'//' + (window.location.host.replace(/^([^.]+)-\\d+/,"$1").replace(/^([^.]+)/, "$1-${port}")).split(':')[0] + '/livereload/client.js'`
        : `'//' + (window.location.host || 'localhost').split(':')[0] + ':${port}/livereload/client.js'`
      return `(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = ${snippetSrc}; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);`
    },
     generateBundle() {
      if (live.enabled) {
        const port = live.options.port
        const customPort = port !== 39430 ? ' on port ' + port : ''
        console.log(green('LiveReload enabled' + customPort))
      }
    },
  }
}

function green(text: string) {
  return '\u001b[1m\u001b[32m' + text + '\u001b[39m\u001b[22m'
}
