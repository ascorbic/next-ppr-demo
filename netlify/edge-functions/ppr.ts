import type { Config, Context } from '@netlify/edge-functions';
import { getDeployStore } from '@netlify/blobs';
import { encodeBase64 } from 'https://deno.land/std@0.223.0/encoding/base64.ts';

const pathToBlobKey = (path: string) =>
  encodeBase64(path === '/' ? '/index' : path);

export default async function handler(request: Request, context: Context) {
  const timing = [];
  const start = Date.now();
  let now = start;
  const url = new URL(request.url);
  console.log('Starting request for', url.pathname);
  const deployStore = getDeployStore();
  console.time('get');
  const data = await deployStore.get(pathToBlobKey(url.pathname), {
    type: 'json',
  });
  console.timeEnd('get');
  timing.push(`blob;dur=${Date.now() - start};desc="get blob"`);
  now = Date.now();
  if (data?.value?.kind !== 'PAGE') {
    console.log('No prerendered HTML found for', url.pathname, data);
    return;
  }

  const { html, headers, postponed } = data.value;

  // This is the prerendered HTML content
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(html));
      controller.close();
    },
  });

  const postponedURL = new URL(`/_next/postponed/resume${url.pathname}`, url);

  const postponedHeaders = new Headers(headers);
  postponedHeaders.set('x-matched-path', postponedURL.pathname);

  const combinedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const startStream = Date.now();
      const postponedResponse = fetch(postponedURL, {
        method: 'POST',
        body: postponed,
        headers: postponedHeaders,
      });

      // First, enqueue the HTML part
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      const shellTiming = `shell;dur=${Date.now() - startStream};desc="shell"`;
      // Now, handle the postponed body stream
      const postponedResult = await postponedResponse;
      const postponedReader = postponedResult.body!.getReader();
      controller.enqueue(
        new TextEncoder().encode(
          `\n<!-- POSTPONED INCOMING!! ${
            Date.now() - start
          }ms. ${shellTiming} -->\n`,
        ),
      );
      while (true) {
        const { done, value } = await postponedReader.read();
        if (done) {
          controller.close();
          break;
        }
        controller.enqueue(value);
      }
    },
  });
  console.log(
    'Returning response for',
    url.pathname,
    ' after ',
    Date.now() - start,
    'ms',
  );
  timing.push(`total;dur=${Date.now() - start};desc="total"`);

  return new Response(combinedStream, {
    headers: {
      ...headers,
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Server-Timing': timing.join(', '),
    },
  });
}

export const config: Config = {
  path: '/',
  excludedPath: ['/_next/*', '/.netlify/*'],
};
