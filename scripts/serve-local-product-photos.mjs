import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { lstat } from 'node:fs/promises'
import { join } from 'node:path'

const photoDirectory = 'D:\\elektronom_photos\\processed'
const host = '127.0.0.1'
const port = 8765

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end()
    return
  }

  const pathname = new URL(request.url ?? '/', `http://${host}`).pathname
  if (pathname === '/health') {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end(request.method === 'HEAD' ? undefined : 'ok')
    return
  }

  if (!pathname.startsWith('/images/')) {
    response.writeHead(404).end()
    return
  }

  let filename
  try {
    filename = decodeURIComponent(pathname.slice('/images/'.length))
  } catch {
    response.writeHead(400).end()
    return
  }

  // The processed directory is flat. Never accept a path or reveal its contents.
  if (!filename || filename === '.' || filename === '..' ||
      filename.includes('/') || filename.includes('\\') || filename.includes('\0') ||
      !filename.toLowerCase().endsWith('.webp')) {
    response.writeHead(404).end()
    return
  }

  const filePath = join(photoDirectory, filename)
  try {
    const file = await lstat(filePath)
    if (!file.isFile() || file.isSymbolicLink()) {
      response.writeHead(404).end()
      return
    }

    response.writeHead(200, {
      'Content-Type': 'image/webp',
      'Content-Length': file.size,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    })
    if (request.method === 'HEAD') {
      response.end()
      return
    }
    createReadStream(filePath).on('error', () => response.destroy()).pipe(response)
  } catch {
    response.writeHead(404).end()
  }
})

server.listen(port, host, () => {
  console.log(`Product photos: http://${host}:${port}/images/<filename>`)
})
