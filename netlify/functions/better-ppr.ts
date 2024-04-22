import type { Config, Context } from '@netlify/functions';
import { getDeployStore } from '@netlify/blobs';

const pathToBlobKey = (path: string) =>
  Buffer.from(path === '/' ? '/index' : path).toString('base64');

const prefix = '/_better-ppr';

export default async function handler(request: Request, context: Context) {
  const timing: Array<string> = [];
  const start = Date.now();
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(prefix, '');
  console.log('Starting request for', url.pathname);
  const deployStore = getDeployStore();
  console.time('get');
  const data = await deployStore.get(pathToBlobKey(url.pathname), {
    type: 'json',
  });
  console.timeEnd('get');
  timing.push(`blob;dur=${Date.now() - start};desc="get blob"`);
  if (data?.value?.kind !== 'PAGE') {
    console.log('No prerendered HTML found for', url.pathname, data);
    return;
  }

  const { html, headers, postponed } = data.value;

  const suffix = `<script type="application/json" id="_ppr-data">${postponed}</script><script type="module">${script}</script></body></html>`;

  return new Response(html + suffix, {
    headers: {
      ...headers,
      'Content-Type': 'text/html',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=36000',
      'Server-Timing': timing.join(', '),
    },
  });
}

const script = /* js */ `
    const url = new URL(window.location.href);
    //   Normally done like this, but now hard-coded
    //   url.pathname = \`/_next/postponed/resume\$\{url.pathname\}\`;
    url.pathname = "/_next/postponed/resume";
    const pprData = document.getElementById('_ppr-data').textContent;
    const response = fetch(url.href, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-matched-path': url.pathname,
      },
      body: pprData,
    });
    document.addEventListener('DOMContentLoaded', () => {
      console.log('DOMContentLoaded');
      response.then(({ body }) => {
        console.log('loaded')
        const reader = body.getReader();
        const decoder = new TextDecoder();
        let buffer = '<scr' + 'ipt>console.log("hi")</scr' + 'ipt>';
        reader.read().then(function processText({ done, value }) {
          if (done) {
            return;
          }
          const data = decoder.decode(value, { stream: true });
          //  Yes, in the year of our lord 2024, this is still needed
          if (data.endsWith('</scr' + 'ipt>') || data.endsWith('</ht'+ 'ml>')) {
            console.log('flushing')
            const range = document.createRange();
            const fragment = range.createContextualFragment(buffer + data);
            console.log(fragment)
            document.body.appendChild(fragment)
            buffer = '';
          } else {
            console.log('buffering')
            buffer += data;
          }
          return reader.read().then(processText);
        });
      });
    });
`;

export const config: Config = {
  path: '/_better-ppr/:path*',
};
