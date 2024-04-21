import type { Config, Context } from '@netlify/edge-functions';

export default async function handler(request: Request) {
  const timing = [];
  const start = Date.now();
  const url = new URL(request.url);
  console.log('Starting request for', url.pathname);

  // This is the prerendered HTML content
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(
          staticHTML + `<!-- ${Date.now() - start}ms -->`,
        ),
      );
      controller.close();
    },
  });

  const direct = url.searchParams.get('direct');

  if (direct) {
    return new Response(
      direct === 'stream'
        ? stream
        : staticHTML + `<!-- ${Date.now() - start}ms -->`,
      {
        headers: {
          'x-direct-type': direct,
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      },
    );
  }

  const postponedURL = new URL(`/_next/postponed/resume${url.pathname}`, url);

  const postponedHeaders = new Headers();
  postponedHeaders.set('x-matched-path', postponedURL.pathname);

  const combinedStream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // First, enqueue the HTML part
      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      const shellTiming = `<!-- shell;dur=${
        Date.now() - start
      };desc="shell" -->`;
      controller.enqueue(new TextEncoder().encode(shellTiming));
      controller.close();
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
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=0, must-revalidate',
      'Server-Timing': timing.join(', '),
    },
  });
}

export const config: Config = {
  path: '/static',
  excludedPath: ['/_next/*', '/.netlify/*'],
};

const staticHTML = `<!DOCTYPE html>
<html lang="en" class="[color-scheme:dark] __variable_2ce99c">
    <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" imageSizes="(min-width: 1184px) 200px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw" fetchPriority="high"/>
        <link rel="preload" as="image" imageSrcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=16&amp;q=75 16w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=32&amp;q=75 32w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=48&amp;q=75 48w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=64&amp;q=75 64w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=96&amp;q=75 96w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" imageSizes="(min-width: 1184px) 75px, (min-width: 768px) 8.33vw, 16.66vw" fetchPriority="high"/>
        <link rel="stylesheet" href="/_next/static/css/eaab3287a8b9f843.css" crossorigin="" data-precedence="next"/>
        <link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-772bbdb00869fae5.js" crossorigin=""/>
        <script src="/_next/static/chunks/afb0b9e5-33901974fe561989.js" async="" crossorigin=""></script>
        <script src="/_next/static/chunks/264-8964608fa71af218.js" async="" crossorigin=""></script>
        <script src="/_next/static/chunks/main-app-8c1785f2742d228d.js" async="" crossorigin=""></script>
        <script src="/_next/static/chunks/708-5a37f787f1cfe275.js" async=""></script>
        <script src="/_next/static/chunks/app/layout-b0d2b28090ae9aad.js" async=""></script>
        <script src="/_next/static/chunks/app/page-2908100d7f610b98.js" async=""></script>
        <title>Next.js Partial Prerendering</title>
        <meta name="description" content="A demo of Next.js using Partial Prerendering."/>
        <meta property="og:title" content="Next.js Partial Prerendering"/>
        <meta property="og:description" content="A demo of Next.js using Partial Prerendering."/>
        <meta property="og:image:type" content="image/png"/>
        <meta property="og:image:width" content="843"/>
        <meta property="og:image:height" content="441"/>
        <meta property="og:image" content="https://partialprerendering.com/opengraph-image.png?f7d8a0e977a6335c"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content="Next.js Partial Prerendering"/>
        <meta name="twitter:description" content="A demo of Next.js using Partial Prerendering."/>
        <meta name="twitter:image:type" content="image/png"/>
        <meta name="twitter:image:width" content="843"/>
        <meta name="twitter:image:height" content="441"/>
        <meta name="twitter:image" content="https://partialprerendering.com/twitter-image.png?f7d8a0e977a6335c"/>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48"/>
        <meta name="next-size-adjust"/>
    </head>
    <body class="overflow-y-scroll bg-gray-1100 bg-[url(&#x27;/grid.svg&#x27;)] pb-36">
        <div class="fixed top-0 z-20 flex w-full flex-col border-b border-gray-800 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r lg:border-gray-800">
            <div class="flex h-14 items-center px-4 py-4 lg:h-auto">
                <div class="group flex w-full items-center gap-x-2.5">
                    <div class="h-7 w-7 rounded-full border border-white/30">
                        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_408_134" style="mask-type:alpha" x="0" y="0" width="180" height="180">
                                <circle cx="90" cy="90" r="90" fill="black"></circle>
                            </mask>
                            <g mask="url(#mask0_408_134)">
                                <circle cx="90" cy="90" r="90" fill="black"></circle>
                                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"></path>
                                <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"></rect>
                            </g>
                            <defs>
                                <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white"></stop>
                                    <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                                    <stop stop-color="white"></stop>
                                    <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h3 class="font-semibold tracking-wide text-gray-400">Partial Prerendering</h3>
                </div>
            </div>
            <button type="button" class="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 lg:hidden">
                <div class="font-medium text-gray-100 group-hover:text-gray-400">Menu</div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="block w-6 text-gray-400">
                    <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path>
                </svg>
            </button>
            <div class="overflow-y-auto lg:static lg:block hidden">
                <div class="prose prose-sm prose-invert max-w-none space-y-6 px-4 pb-20 text-gray-300">
                    <div class="text-gray-400">
                        <p>
                            <span class="font-bold text-vercel-pink">Pink dots</span>
                            <!-- -->
                            denote artificially delayed responses for demo purposes:
                        </p>
                        <ul>
                            <li>Shipping estimate → 
                            <!-- -->
                            400
                            <!-- -->
                            ms</li>
                            <li>Recommended products → 
                            <!-- -->
                            800
                            <!-- -->
                            ms</li>
                            <li>Reviews → 
                            <!-- -->
                            1000
                            <!-- -->
                            ms</li>
                        </ul>
                    </div>
                    <p>
                        <a target="_blank" href="https://vercel.com/blog/partial-prerendering-with-next-js-creating-a-new-default-rendering-model">Partial Prerendering</a>
                        <!-- -->
                        combines ultra-quick static edge delivery with fully dynamic capabilities. This is different from how your application behaves today, where entire routes are either fully static or dynamic.
                    </p>
                    <p>How it works:</p>
                    <ul>
                        <li>
                            A static route <em>shell</em>
                            is served immediately, this makes the initial load fast.
                        </li>
                        <li>
                            The shell leaves <em>holes</em>
                            where dynamic content (that might be slower) will be streamed in to minimize the perceived overall page load time.
                        </li>
                        <li>The async holes are loaded in parallel, reducing the overall load time of the page.</li>
                    </ul>
                    <p class="text-gray-400">Try refreshing the page to restart the demo.</p>
                </div>
                <div class="absolute hidden sm:block inset-x-0 bottom-3 mx-3 rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                    <div class="flex flex-row justify-between rounded-lg bg-black p-3.5 lg:px-5 lg:py-3">
                        <div class="flex items-center gap-x-1.5">
                            <div class="text-sm text-gray-400">By</div>
                            <a href="https://vercel.com" title="Vercel">
                                <div class="w-16 text-gray-100 hover:text-gray-50">
                                    <svg viewBox="0 0 4438 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2223.75 250C2051.25 250 1926.87 362.5 1926.87 531.25C1926.87 700 2066.72 812.5 2239.38 812.5C2343.59 812.5 2435.47 771.25 2492.34 701.719L2372.81 632.656C2341.25 667.188 2293.28 687.344 2239.38 687.344C2164.53 687.344 2100.94 648.281 2077.34 585.781H2515.16C2518.59 568.281 2520.63 550.156 2520.63 531.094C2520.63 362.5 2396.41 250 2223.75 250ZM2076.09 476.562C2095.62 414.219 2149.06 375 2223.75 375C2298.59 375 2352.03 414.219 2371.41 476.562H2076.09ZM2040.78 78.125L1607.81 828.125L1174.69 78.125H1337.03L1607.66 546.875L1878.28 78.125H2040.78ZM577.344 0L1154.69 1000H0L577.344 0ZM3148.75 531.25C3148.75 625 3210 687.5 3305 687.5C3369.38 687.5 3417.66 658.281 3442.5 610.625L3562.5 679.844C3512.81 762.656 3419.69 812.5 3305 812.5C3132.34 812.5 3008.13 700 3008.13 531.25C3008.13 362.5 3132.5 250 3305 250C3419.69 250 3512.66 299.844 3562.5 382.656L3442.5 451.875C3417.66 404.219 3369.38 375 3305 375C3210.16 375 3148.75 437.5 3148.75 531.25ZM4437.5 78.125V796.875H4296.88V78.125H4437.5ZM3906.25 250C3733.75 250 3609.38 362.5 3609.38 531.25C3609.38 700 3749.38 812.5 3921.88 812.5C4026.09 812.5 4117.97 771.25 4174.84 701.719L4055.31 632.656C4023.75 667.188 3975.78 687.344 3921.88 687.344C3847.03 687.344 3783.44 648.281 3759.84 585.781H4197.66C4201.09 568.281 4203.12 550.156 4203.12 531.094C4203.12 362.5 4078.91 250 3906.25 250ZM3758.59 476.562C3778.13 414.219 3831.41 375 3906.25 375C3981.09 375 4034.53 414.219 4053.91 476.562H3758.59ZM2961.25 265.625V417.031C2945.63 412.5 2929.06 409.375 2911.25 409.375C2820.47 409.375 2755 471.875 2755 565.625V796.875H2614.38V265.625H2755V409.375C2755 330 2847.34 265.625 2961.25 265.625Z"></path>
                                    </svg>
                                </div>
                            </a>
                        </div>
                        <div class="text-sm text-gray-400">
                            <a class="underline decoration-dotted underline-offset-4 transition-colors hover:text-gray-300" href="https://github.com/vercel-labs/next-partial-prerendering" target="_blank" rel="noreferrer">View code</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lg:pl-72">
            <div class="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
                <div class="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-black/20">
                    <div class="rounded-lg bg-black p-3.5 lg:p-6">
                        <div class="space-y-10">
                            <div class="flex items-center justify-between gap-x-3 rounded-lg bg-gray-800 px-3 py-3 lg:px-5 lg:py-4">
                                <div class="flex gap-x-3">
                                    <div class="h-10 w-10 hover:opacity-70">
                                        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <mask id="mask0_408_134" style="mask-type:alpha" x="0" y="0" width="180" height="180">
                                                <circle cx="90" cy="90" r="90" fill="black"></circle>
                                            </mask>
                                            <g mask="url(#mask0_408_134)">
                                                <circle cx="90" cy="90" r="90" fill="black"></circle>
                                                <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"></path>
                                                <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)"></rect>
                                            </g>
                                            <defs>
                                                <linearGradient id="paint0_linear_408_134" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="white"></stop>
                                                    <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                                                </linearGradient>
                                                <linearGradient id="paint1_linear_408_134" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                                                    <stop stop-color="white"></stop>
                                                    <stop offset="1" stop-color="white" stop-opacity="0"></stop>
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div class="relative flex-1">
                                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="h-5 w-5 text-gray-300">
                                                <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <input aria-label="Search" type="search" id="search" class="block w-full rounded-full border-none bg-gray-600 pl-10 font-medium text-gray-200 focus:border-vercel-pink focus:ring-2 focus:ring-vercel-pink" autoComplete="off" name="search"/>
                                    </div>
                                </div>
                                <div class="flex shrink-0 gap-x-3">
                                    <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-600 text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-6 text-white">
                                            <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"></path>
                                        </svg>
                                        <div class="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-vercel-cyan text-sm font-bold text-cyan-800">
                                            <!--$?-->
                                            <template id="B:0"></template>
                                            <span></span>
                                            <!--/$-->
                                        </div>
                                    </div>
                                    <img alt="User" fetchPriority="high" width="40" height="40" decoding="async" data-nimg="1" class="rounded-full" style="color:transparent" srcSet="/_next/image?url=%2Fprince-akachi-LWkFHEGpleE-unsplash.jpg&amp;w=48&amp;q=75 1x, /_next/image?url=%2Fprince-akachi-LWkFHEGpleE-unsplash.jpg&amp;w=96&amp;q=75 2x" src="/_next/image?url=%2Fprince-akachi-LWkFHEGpleE-unsplash.jpg&amp;w=96&amp;q=75"/>
                                </div>
                            </div>
                            <div class="space-y-8 lg:space-y-14">
                                <div class="grid grid-cols-4 gap-6">
                                    <div class="col-span-2 md:order-1 md:col-span-1">
                                        <div class="space-y-2">
                                            <div class="relative aspect-square">
                                                <img alt="Donec sit elit" fetchPriority="high" decoding="async" data-nimg="fill" class="block rounded-lg grayscale" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" sizes="(min-width: 1184px) 200px, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, 50vw" srcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75"/>
                                            </div>
                                            <div class="flex gap-x-2">
                                                <div class="relative aspect-square w-1/3">
                                                    <img alt="Donec sit elit" fetchPriority="high" decoding="async" data-nimg="fill" class="rounded-lg grayscale" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" sizes="(min-width: 1184px) 75px, (min-width: 768px) 8.33vw, 16.66vw" srcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=16&amp;q=75 16w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=32&amp;q=75 32w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=48&amp;q=75 48w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=64&amp;q=75 64w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=96&amp;q=75 96w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75"/>
                                                </div>
                                                <div class="relative aspect-square w-1/3">
                                                    <img alt="Donec sit elit" fetchPriority="high" decoding="async" data-nimg="fill" class="rounded-lg grayscale" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" sizes="(min-width: 1184px) 75px, (min-width: 768px) 8.33vw, 16.66vw" srcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=16&amp;q=75 16w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=32&amp;q=75 32w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=48&amp;q=75 48w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=64&amp;q=75 64w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=96&amp;q=75 96w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75"/>
                                                </div>
                                                <div class="relative aspect-square w-1/3">
                                                    <img alt="Donec sit elit" fetchPriority="high" decoding="async" data-nimg="fill" class="rounded-lg grayscale" style="position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent" sizes="(min-width: 1184px) 75px, (min-width: 768px) 8.33vw, 16.66vw" srcSet="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=16&amp;q=75 16w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=32&amp;q=75 32w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=48&amp;q=75 48w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=64&amp;q=75 64w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=96&amp;q=75 96w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=128&amp;q=75 128w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=256&amp;q=75 256w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=384&amp;q=75 384w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=640&amp;q=75 640w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=750&amp;q=75 750w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=828&amp;q=75 828w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1080&amp;q=75 1080w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1200&amp;q=75 1200w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=1920&amp;q=75 1920w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=2048&amp;q=75 2048w, /_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=%2Feniko-kis-KsLPTsYaqIQ-unsplash.jpg&amp;w=3840&amp;q=75"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-2 md:order-3 md:col-span-1">
                                        <div class="space-y-4 rounded-lg bg-gray-900 p-3">
                                            <div class="flex">
                                                <div class="rounded bg-gray-600 px-1.5 text-xs font-medium leading-5 text-white">Expires in 
                                                <!-- -->
                                                2 days</div>
                                            </div>
                                            <div class="flex gap-x-1.5">
                                                <div class="text-lg font-bold leading-snug text-vercel-cyan">-
                                                <!-- -->
                                                10
                                                <!-- -->
                                                %</div>
                                                <div class="flex">
                                                    <div class="text-sm leading-snug text-white">$</div>
                                                    <div class="text-lg font-bold leading-snug text-white">37.8</div>
                                                </div>
                                                <div class="text-sm leading-snug text-gray-400 line-through">$
                                                <!-- -->
                                                42</div>
                                            </div>
                                            <div class="relative">
                                                <div class="absolute -left-4 top-1">
                                                    <span class="flex h-[11px] w-[11px]">
                                                        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-vercel-pink opacity-75"></span>
                                                        <span class="relative inline-flex h-[11px] w-[11px] rounded-full bg-vercel-pink"></span>
                                                    </span>
                                                </div>
                                            </div>
                                            <!--$?-->
                                            <template id="B:6"></template>
                                            <div class="text-sm">
                                                <span class="space-x-0.5">
                                                    <span class="inline-flex animate-[loading_1.4s_ease-in-out_infinite] rounded-full">•</span>
                                                    <span class="inline-flex animate-[loading_1.4s_ease-in-out_0.2s_infinite] rounded-full">•</span>
                                                    <span class="inline-flex animate-[loading_1.4s_ease-in-out_0.4s_infinite] rounded-full">•</span>
                                                </span>
                                            </div>
                                            <!--/$-->
                                            <!--$?-->
                                            <template id="B:8"></template>
                                            <button class="relative w-full items-center space-x-2 rounded-lg bg-vercel-blue px-3 py-1  text-sm font-medium text-white hover:bg-vercel-blue/90 disabled:text-white/70">Add to Cart</button>
                                            <!--/$-->
                                        </div>
                                    </div>
                                    <div class="col-span-full space-y-4 md:order-2 md:col-span-2">
                                        <div class="truncate text-xl font-medium text-white lg:text-2xl">Donec sit elit</div>
                                        <div class="flex gap-x-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-4 text-white">
                                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-4 text-white">
                                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-4 text-white">
                                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-4 text-white">
                                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path>
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="w-4 text-white">
                                                <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clip-rule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <div class="space-y-4 text-sm text-gray-200">
                                            <p>Morbi eu ullamcorper urna, a condimentum massa. In fermentum ante non turpis cursus fringilla. Praesent neque eros, gravida vel ante sed, vehicula elementum orci. Sed eu ipsum eget enim mattis mollis.</p>
                                            <p>Morbi eu ullamcorper urna, a condimentum massa. In fermentum ante non turpis cursus fringilla. Praesent neque eros, gravida vel ante sed, vehicula elementum orci. Sed eu ipsum eget enim mattis mollis.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="relative">
                                    <div class="absolute -left-4 top-1">
                                        <span class="flex h-[11px] w-[11px]">
                                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-vercel-pink opacity-75"></span>
                                            <span class="relative inline-flex h-[11px] w-[11px] rounded-full bg-vercel-pink"></span>
                                        </span>
                                    </div>
                                </div>
                                <!--$?-->
                                <template id="B:2"></template>
                                <div class="space-y-6 pb-[5px]">
                                    <div class="space-y-2">
                                        <div class="h-6 w-1/3 rounded-lg bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                        <div class="h-4 w-1/2 rounded-lg bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                    </div>
                                    <div class="grid grid-cols-4 gap-6">
                                        <div class="col-span-4 space-y-4 lg:col-span-1">
                                            <div class="relative h-[167px] rounded-xl bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-6 w-1/3 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                        <div class="col-span-4 space-y-4 lg:col-span-1">
                                            <div class="relative h-[167px] rounded-xl bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-6 w-1/3 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                        <div class="col-span-4 space-y-4 lg:col-span-1">
                                            <div class="relative h-[167px] rounded-xl bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-6 w-1/3 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                        <div class="col-span-4 space-y-4 lg:col-span-1">
                                            <div class="relative h-[167px] rounded-xl bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-6 w-1/3 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                                <!--/$-->
                                <div class="relative">
                                    <div class="absolute -left-4 top-1">
                                        <span class="flex h-[11px] w-[11px]">
                                            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-vercel-pink opacity-75"></span>
                                            <span class="relative inline-flex h-[11px] w-[11px] rounded-full bg-vercel-pink"></span>
                                        </span>
                                    </div>
                                </div>
                                <!--$?-->
                                <template id="B:4"></template>
                                <div class="space-y-6">
                                    <div class="h-7 w-2/5 rounded-lg bg-gray-900 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"></div>
                                    <div class="space-y-8">
                                        <div class="space-y-4">
                                            <div class="h-6 w-2/6 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-1/6 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                        <div class="space-y-4">
                                            <div class="h-6 w-2/6 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-1/6 rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-full rounded-lg bg-gray-900"></div>
                                            <div class="h-4 w-4/6 rounded-lg bg-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                                <!--/$-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/_next/static/chunks/webpack-772bbdb00869fae5.js" crossorigin="" async=""></script>
        <div hidden id="S:0">
            <template id="P:1"></template>
        </div>
        <div hidden id="S:6">
            <template id="P:7"></template>
        </div>
        <div hidden id="S:8">
            <template id="P:9"></template>
        </div>
        <div hidden id="S:2">
            <template id="P:3"></template>
        </div>
        <div hidden id="S:4">
            <template id="P:5"></template>
        </div>`;
