import { join } from 'path'

const srcDir = join(import.meta.dir, 'src')

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.mp3': 'audio/mpeg',
  '.json': 'application/json',
}

function getMimeType(path: string): string {
  const ext = path.substring(path.lastIndexOf('.'))
  return mimeTypes[ext] || 'application/octet-stream'
}

async function bundleScript(entrypoint: string): Promise<string> {
  const result = await Bun.build({
    entrypoints: [entrypoint],
    format: 'esm',
    target: 'browser',
  })

  if (!result.success) {
    console.error('Build failed:', result.logs)
    throw new Error('Build failed')
  }

  return await result.outputs[0].text()
}

const server = Bun.serve({
  port: 1234,
  async fetch(req) {
    const url = new URL(req.url)
    let pathname = url.pathname === '/' ? '/index.html' : url.pathname

    const filePath = join(srcDir, pathname)

    try {
      const file = Bun.file(filePath)
      const exists = await file.exists()

      if (exists) {
        if (pathname.endsWith('.js')) {
          const bundled = await bundleScript(filePath)
          return new Response(bundled, {
            headers: {
              'Content-Type': 'text/javascript',
              'Access-Control-Allow-Origin': '*',
            },
          })
        }

        return new Response(file, {
          headers: {
            'Content-Type': getMimeType(pathname),
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }

    return new Response('Not Found', { status: 404 })
  },
})

console.log(`🎵 Audio demo running at http://localhost:${server.port}`)
