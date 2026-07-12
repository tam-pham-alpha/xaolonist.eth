---
slug: "tailwind-migration-gatsby-clean"
title: "Migrating to Tailwind CSS and the Gatsby Cache Cleaning Lesson"
summary: "How he cleared the ruins of CSS-in-JS to step into the minimal build-time world of Tailwind CSS, and a practical lesson in cache cleanup"
author: "Tam Pham"
cowriter: "@aethery"
category: "forge"
status: "published"
date: "2026-05-30"
cover: "./cover.png"
lang: "en"
---

Hey, it's him again...

Today he decided to perform a major surgery on his digital home: completely removing styled-components to replace it with Tailwind CSS. He realized that, after years of operation, the weight of CSS-in-JS (styled-components) had become too heavy a baggage for a static blog.

Everything originally started with initial convenience: he liked writing CSS directly in JavaScript, liked the isolation of styled components. But the price to pay was the silent delay that the browser had to endure. CSS-in-JS works at runtime, meaning every time a user loads a page, the browser must download the styled-components library, parse the JavaScript, and then calculate and inject CSS into the DOM. For low-spec mobile devices, this is a significant burden. Not to mention, the JS bundle size swells by dozens of Kilobytes just to support this runtime overhead.

Tailwind CSS, conversely, works at build-time. All utility classes are scanned, analyzed, and compiled into a static, extremely minimal CSS file before publishing. When a user visits the site, the browser receives pure CSS, rendering the interface immediately without spending a single CPU cycle on JavaScript style calculation. Performance goes up, bundle size drops visibly. It is maximum minimalism, returning the digital home to its most natural state: pure HTML and CSS.

However, when he finished cleaning up package.json, removing the plugin, and typing the command to run the dev server to admire the new interface, the terminal threw a bucket of cold water on him. Webpack reported an error: could not find `gatsby-plugin-styled-components/gatsby-browser.js`. He checked the source code, certain that not a single import of styled-components remained. Yet Gatsby was still reporting errors demanding the old configuration.

He researched and recognized how gatsby-cache operates.

To optimize build speed, Gatsby stores all intermediate compilation results in the `.cache` directory. But when we change the foundational structure of the system, removing core libraries, the old cache suddenly becomes outdated configuration. The system tries to reuse old data but collides with the fact that the old resources no longer exist, leading to compilation errors within Webpack.

He understood that, to build a new thing that is faster and cleaner, sometimes we cannot patch it on top of old files. He typed the command to wipe the cache:
```bash
yarn clean
```

The command ran, and the entire `.cache` and `public` directories were wiped clean. The system returned to its original, completely empty state. And when he ran the dev command again, everything compiled smoothly and quickly in just a few seconds.

This technical lesson provides practical experience on system optimization:
*   To optimize performance, eliminate unnecessary runtime burdens, returning everything to its most minimal and original form
*   When changing the core structure of the source code, it is necessary to completely clear the old cache to avoid unnecessary compilation conflicts
*   Periodically cleaning the cache and temporary files is the best way to keep the development environment clean and running at peak performance

Only when the old files are truly cleared can the system run at maximum speed, smoothly and accurately.

*❤️ cowriter aethery*
