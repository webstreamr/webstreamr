# WebStreamr

[![Tests](https://github.com/webstreamr/webstreamr/workflows/Tests/badge.svg)](https://github.com/webstreamr/webstreamr/actions/workflows/tests.yml)
[![GitHub release](https://img.shields.io/github/v/release/webstreamr/webstreamr)](https://github.com/webstreamr/webstreamr/releases)
![GitHub License](https://img.shields.io/github/license/webstreamr/webstreamr)

[Stremio](https://www.stremio.com/) add-on which provides HTTP URLs from streaming websites.

## Public instance

A public instance is available at https://webstreamr.hayd.uk. Hosting infrastructure for this instance is donated by [ElfHosted](https://elfhosted.com), and independently maintained by [Hayduk](https://hayd.uk).

## Hosting

Don't want to use the public instance, or concerned about reliability during periods of high use? It's open-source, you can host it yourself!

### ElfHosted (easy mode)

Self-hosting to stressful? ElfHosted offer [ready-to-go, turn-key WebStreamr instances](https://store.elfhosted.com/product/webstreamr/) with $1, 7-day trials. Additionally, 33% of your subscription directly supports your developer! ❤️

(*ElfHosted also offer advanced private hosting of the [top Stremio Addons](https://store.elfhosted.com/product-category/stremio-addons/elf/webstreamr/), as well as [turn-key bundles providing streaming from RealDebrid with Plex, Emby, or Jellyfin](https://store.elfhosted.com/product-category/streaming-bundles/elf/webstreamr/)*)

### Self-Hosting

You can build an image using the [Dockerfile](./Dockerfile) and run it.

You need to add the TMDB API Read Access Token, you can find it here https://www.themoviedb.org/settings/api, a subscription is needed.
in the Dockerfile you need also the EXPOSE port
```
ENV TMDB_ACCESS_TOKEN={TMDB API Read Access Token}
EXPOSE 51546

CMD ["node", "dist/index.js"]
```

Alternatively, you can also start WebStreamr directly via

```shell
npm install
npm run build
npm start
```
