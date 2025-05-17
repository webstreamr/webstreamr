# WebStreamr

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

Alternatively, you can also start WebStreamr directly via

```shell
npm install
npm run build
npm start
```
