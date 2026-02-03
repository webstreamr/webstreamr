# WebStreamr

[![Tests](https://github.com/webstreamr/webstreamr/workflows/Tests/badge.svg)](https://github.com/webstreamr/webstreamr/actions/workflows/tests.yml)
[![GitHub release](https://img.shields.io/github/v/release/webstreamr/webstreamr)](https://github.com/webstreamr/webstreamr/releases)
![GitHub License](https://img.shields.io/github/license/webstreamr/webstreamr)

[Stremio](https://www.stremio.com/) add-on which provides HTTP URLs from streaming websites.

## Public instance

A public instance is available at https://webstreamr.hayd.uk. Hosting infrastructure for this instance is donated by [ElfHosted](https://elfhosted.com), and independently maintained by [Hayduk](https://hayd.uk).

## MediaFlow Proxy

[MediaFlow Proxy](https://github.com/mhdzumair/mediaflow-proxy/) can be added when configuration the add-on to gain access to a couple of more file hosters.
It depends highly on the language / source used if that unlocks more streams or not.

MediaFlow proxy is needed because some hosters ip-lock streams and the add-on does not run on the same device that will stream the video.

The following hosters can be used only with MediaFlow Proxy:

- Fastream
- FileLions
- FileMoon
- LuluStream
- Mixdrop
- Streamtape
- VOE

MediaFlow proxy can either be self-hosted or acquired via bundle from [ElfHosted](https://docs.elfhosted.com/app/mediaflow-proxy/).

## Hosting

Don't want to use the public instance, or concerned about reliability during periods of high use? It's open-source, you can host it yourself!

### ElfHosted (easy mode)

Self-hosting to stressful? ElfHosted offer [ready-to-go, turn-key WebStreamr instances](https://store.elfhosted.com/product/webstreamr/) with $1, 7-day trials. Additionally, 33% of your subscription directly supports your developer! ❤️

(*ElfHosted also offer advanced private hosting of the [top Stremio Addons](https://store.elfhosted.com/product-category/stremio-addons/elf/webstreamr/), as well as [turn-key bundles providing streaming from RealDebrid with Plex, Emby, or Jellyfin](https://store.elfhosted.com/product-category/streaming-bundles/elf/webstreamr/)*)

### Self-Hosting

You can run the latest WebStreamr via Docker. E.g.

```shell
 docker run \
    --detach=true \
    --name webstreamr \
    --rm \
    --pull always \
    --publish 51546:51546 \
    --env TMDB_ACCESS_TOKEN="YOUR_TOKEN" \
    --volume /tmp:/tmp \
    webstreamr/webstreamr
```

### Environment variables

#### `CACHE_DIR`

Optional. Directory for persistent caches using SQLite files. Default: OS tmp dir.

#### `CONFIGURATION_DESCRIPTION`

Optional. To customize the description shown on the configuration page.

#### `DISABLED_EXTRACTORS`

Optional. Comma separated list of extractors which should be disabled. E.g. `doodstream,vidsrc`

#### `DISABLED_SOURCES`

Optional. Comma separated list of sources which should be disabled. E.g. `frembed,vidsrc`

#### `FLARESOLVERR_ENDPOINT`

Optional. If domains show Cloudflare challenges, FlareSolverr can be used to work around them. E.g. `http://flaresolverr:8191`
Proxy configuration is passed-through and only a single session is used to save resources. Byparr is not supported.

#### `MANIFEST_ID`

Optional. Add-on manifest ID. Default: `webstreamr`

#### `MANIFEST_NAME`

Optional. Add-on manifest name. Default: `WebStreamr`

#### `PORT`

Optional. Port of the node web server. Default: `51546`

#### `PROXY_CONFIG`

Optional. Proxies which should be used based on domain. Supports minimatch. E.g. `dood.to:http://USERNAME:PASSWORD@IP:PORT,*:socks5://172.17.0.1:1080` would use an http proxy for dood.to and a socks5 proxy for all other domains.

Some hosters are a bit picky when it comes to IPs. Best case is if you use a residential IP.
If you can't do that, then I suggest to use a VPN / proxy like Cloudflare WARP.
DoodStream is not working with WARP.
Free Webshare proxies seem to work with it.

#### `TMDB_ACCESS_TOKEN`

**Required**. TMDB access token to get information like title and year for content. Use the [API Read Access Token](https://www.themoviedb.org/settings/api).
