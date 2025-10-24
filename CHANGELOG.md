# Changelog

## [0.56.5](https://github.com/webstreamr/webstreamr/compare/v0.56.4...v0.56.5) (2025-10-24)


### Miscellaneous Chores

* add host info of relevant URL to all errors ([cc3d30b](https://github.com/webstreamr/webstreamr/commit/cc3d30be2fbd234597b1019ce3fe7313b39cf314))
* cache playlist heights for a month ([56e72b7](https://github.com/webstreamr/webstreamr/commit/56e72b73fe26dd37bf9b58e3281f0b9fb6d2eff8))
* **deps:** lock file maintenance ([#449](https://github.com/webstreamr/webstreamr/issues/449)) ([a9b81d0](https://github.com/webstreamr/webstreamr/commit/a9b81d00c064e566671316edbb0e251704112ecc))
* **deps:** update dependency @types/node to v22.18.11 ([#448](https://github.com/webstreamr/webstreamr/issues/448)) ([03bb9fe](https://github.com/webstreamr/webstreamr/commit/03bb9fea798b02c56379a0a6accdfb08f8badb01))
* **deps:** update dependency typescript-eslint to v8.46.2 ([#451](https://github.com/webstreamr/webstreamr/issues/451)) ([c8b6cf2](https://github.com/webstreamr/webstreamr/commit/c8b6cf27328044d249963750011c7f41aa0c2694))
* **extractor:** add KinoGer domains ([23da8dc](https://github.com/webstreamr/webstreamr/commit/23da8dc637452c08cabe46c0c6c608f030d19a14))
* **extractor:** add VOE domain ([e2eaa91](https://github.com/webstreamr/webstreamr/commit/e2eaa9143bbf793884ca3559c1b9a98f70e518eb))
* **extractor:** do not make any requests for external URLs ([77164df](https://github.com/webstreamr/webstreamr/commit/77164dfaa7e42688901da87242fbc04cf8a792d0))
* remove noCache option ([e6d8d50](https://github.com/webstreamr/webstreamr/commit/e6d8d5076c956398540a5d2afbc94633fedb172c))
* remove proxyConfig option ([6203863](https://github.com/webstreamr/webstreamr/commit/6203863523a495331e64582960b609a63ea0df32))

## [0.56.4](https://github.com/webstreamr/webstreamr/compare/v0.56.3...v0.56.4) (2025-10-18)


### Miscellaneous Chores

* mark VidSrc as being multi instead of English ([ae7b784](https://github.com/webstreamr/webstreamr/commit/ae7b784783a00dc529bd3330087389de16c01acc))
* switch to new VidSrc domains, pass-through TMDB IDs if given ([d59658f](https://github.com/webstreamr/webstreamr/commit/d59658fb7b42e509df19fc6b154c22c8a01db9b0))

## [0.56.3](https://github.com/webstreamr/webstreamr/compare/v0.56.2...v0.56.3) (2025-10-18)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5.5.0 ([#441](https://github.com/webstreamr/webstreamr/issues/441)) ([209ec26](https://github.com/webstreamr/webstreamr/commit/209ec2673f639892208bf824875b5b6bc8796da6))
* **deps:** update dependency cacheable to v2.1.1 ([#438](https://github.com/webstreamr/webstreamr/issues/438)) ([6fffb57](https://github.com/webstreamr/webstreamr/commit/6fffb57a8dc3c245afa460308001ce5f7b6afdc6))
* **deps:** update eslint monorepo to v9.38.0 ([#439](https://github.com/webstreamr/webstreamr/issues/439)) ([5d6a814](https://github.com/webstreamr/webstreamr/commit/5d6a8145c37a17cc3ef9b71963bf4a398ddf3f36))
* **extractor:** add goofy-banana.com to Voe ([ad61be8](https://github.com/webstreamr/webstreamr/commit/ad61be862616e10f04a9eb7bdf48c875874ae13f))

## [0.56.2](https://github.com/webstreamr/webstreamr/compare/v0.56.1...v0.56.2) (2025-10-17)


### Bug Fixes

* only push lates tag, no need for invalid version tags ([e989fc0](https://github.com/webstreamr/webstreamr/commit/e989fc05d5873665626fbb94427904796e6fe2d4))

## [0.56.1](https://github.com/webstreamr/webstreamr/compare/v0.56.0...v0.56.1) (2025-10-17)


### Bug Fixes

* push latest for release tags ([a937990](https://github.com/webstreamr/webstreamr/commit/a93799036d51178263fec8fc60ab25e45b1458a3))

## [0.56.0](https://github.com/webstreamr/webstreamr/compare/v0.55.1...v0.56.0) (2025-10-17)


### Miscellaneous Chores

* full remove Fsst ([bcd8688](https://github.com/webstreamr/webstreamr/commit/bcd868850d2f2bd242d100c42c96dac9f6dbf709))
* tag 4KHDHub with Indian flag ([177739e](https://github.com/webstreamr/webstreamr/commit/177739e7cdd91f22bf3f7c131092ddc710505727))
* throw explicit error if required TMDB_ACCESS_TOKEN env var is not set ([6f60c49](https://github.com/webstreamr/webstreamr/commit/6f60c49bd1fb6c14915734418ac1b245451c839e))


### Documentation

* add info about MediaFlow Proxy ([a76e725](https://github.com/webstreamr/webstreamr/commit/a76e7254ff13ff1ea4fb074249a59c2a01213b51))
* add more infos about proxy config ([eaa95e8](https://github.com/webstreamr/webstreamr/commit/eaa95e8cd9bf53650ddf47c040dc50af29aa09c0))
* default self hosting docs to official Docker image ([14da572](https://github.com/webstreamr/webstreamr/commit/14da572830384d71e38603a4c4f566a55fa61c52))
* document environment variables ([c7b507c](https://github.com/webstreamr/webstreamr/commit/c7b507ca6b7776aa450e467075543847e983aace))


### Features

* push docker latest build for tags ([0018ccc](https://github.com/webstreamr/webstreamr/commit/0018ccc9299da174e108829409c56ec34c39a569))

## [0.55.1](https://github.com/webstreamr/webstreamr/compare/v0.55.0...v0.55.1) (2025-10-16)


### Bug Fixes

* **source:** query TMDB for Albanian info for Kokoshka ([066424e](https://github.com/webstreamr/webstreamr/commit/066424e0871f8a2497122e45695a7afd3dbfd8f0))

## [0.55.0](https://github.com/webstreamr/webstreamr/compare/v0.54.4...v0.55.0) (2025-10-16)


### Features

* add Albanian source Kokoshka ([#430](https://github.com/webstreamr/webstreamr/issues/430)) ([a4fb495](https://github.com/webstreamr/webstreamr/commit/a4fb495e28752ea9f646c0fb8d24d66373a979e9))

## [0.54.4](https://github.com/webstreamr/webstreamr/compare/v0.54.3...v0.54.4) (2025-10-15)


### Miscellaneous Chores

* configure devEngines in package.json ([0830635](https://github.com/webstreamr/webstreamr/commit/0830635947c7b6b10017c265077a5a2e6b79ef29))
* **deps:** lock file maintenance ([#424](https://github.com/webstreamr/webstreamr/issues/424)) ([cf1f3e9](https://github.com/webstreamr/webstreamr/commit/cf1f3e9eed89c3dff264126788aedd8f0aabecf0))
* **deps:** update actions/setup-node action to v6 ([#426](https://github.com/webstreamr/webstreamr/issues/426)) ([3007698](https://github.com/webstreamr/webstreamr/commit/3007698b1ba96bbf747130d3f636e40ab29f4e4b))
* **deps:** update dependency @keyv/sqlite to v4.0.6 ([#420](https://github.com/webstreamr/webstreamr/issues/420)) ([8761eee](https://github.com/webstreamr/webstreamr/commit/8761eee22fb9bf72271c9a82ae18d5116a283f8c))
* **deps:** update dependency @types/node to v22.18.10 ([#423](https://github.com/webstreamr/webstreamr/issues/423)) ([c5c4c1a](https://github.com/webstreamr/webstreamr/commit/c5c4c1a41c3b025764fe751a91ed7b1b4c56ef65))
* **deps:** update dependency ts-jest to v29.4.5 ([#422](https://github.com/webstreamr/webstreamr/issues/422)) ([fbffe3a](https://github.com/webstreamr/webstreamr/commit/fbffe3aa67e98361500364c40477cfc53951e109))
* **deps:** update dependency typescript-eslint to v8.46.1 ([#425](https://github.com/webstreamr/webstreamr/issues/425)) ([c7040e9](https://github.com/webstreamr/webstreamr/commit/c7040e9936ae476a1a9cb40bef6ea99b88361cd3))
* fully remove soaper ([da24e96](https://github.com/webstreamr/webstreamr/commit/da24e96fb486160aecffaa9532aa02e76c9d87bb))


### Continuous Integration

* remove explicit caching of node modules ([6f3233e](https://github.com/webstreamr/webstreamr/commit/6f3233eefde5e471d7083602e531aaa730217f50))


### Bug Fixes

* add manual imdb -&gt; tmdb mapping for "Monster: The Ed Gein Story(2025)" ([405a8ef](https://github.com/webstreamr/webstreamr/commit/405a8efad349a287744d0a584a2ff813a8b2d030))
* add manual imdb -&gt; tmdb mapping for "Monsters: The Lyle and Erik Menendez Story (2024)" ([1a56d7e](https://github.com/webstreamr/webstreamr/commit/1a56d7ef91cbaa337d52514fc2467b83da46cf9e))
* **source:** remove PrimeWire ([a42edcd](https://github.com/webstreamr/webstreamr/commit/a42edcd438c6577c93170c4178fef2f878a78f19))
* **source:** switch from imdb to tmdb search for CineHDPlus ([c88b379](https://github.com/webstreamr/webstreamr/commit/c88b3798f03974183666e7b0e6c3806aae477925))
* **source:** switch from imdb to tmdb search for StreamKiste ([076f853](https://github.com/webstreamr/webstreamr/commit/076f853a5bf804537ec019564ce0ab50fd152f2a))

## [0.54.3](https://github.com/webstreamr/webstreamr/compare/v0.54.2...v0.54.3) (2025-10-07)


### Miscellaneous Chores

* **extractor:** use MEDIAFLOW_DEFAULT_INIT where it was forgotten ([bab0da2](https://github.com/webstreamr/webstreamr/commit/bab0da2a8f141c530fdfe24f5ef872660cbe032c))
* increase MFP related timeouts ([a3b90bf](https://github.com/webstreamr/webstreamr/commit/a3b90bf19a008c6cce2b0a04029c99ef42692148))


### Bug Fixes

* **extractor:** support Dropload with missing height/size info ([06e0ba2](https://github.com/webstreamr/webstreamr/commit/06e0ba23d7a83ec981c227fe02357d6c040b1100))


### Performance Improvements

* **extractor:** do not guess resolution via MFP playlist for FileLions ([a7360b6](https://github.com/webstreamr/webstreamr/commit/a7360b68f0ff2c2794964b4b43999ddf27fbbcc3))
* **extractor:** do not guess resolution via MFP playlist for FileMoon ([312f606](https://github.com/webstreamr/webstreamr/commit/312f60660af4239cd837e64a3e8a05678aa1a964))
* **extractor:** do not guess resolution via MFP playlist for LuluStream ([b3db546](https://github.com/webstreamr/webstreamr/commit/b3db546e00413f68d04ee53851b8b5cff6db9152))
* **extractor:** do not guess resolution via MFP playlist for Voe ([8fb3320](https://github.com/webstreamr/webstreamr/commit/8fb33208687208534b3ce5783299cc278883ba50))
* **extractor:** do not guess size from mp4 for DoodStream ([b8c5c1a](https://github.com/webstreamr/webstreamr/commit/b8c5c1a4f39579c8bd95e35783e58b3ba6e24a35))
* **extractor:** do not guess size from mp4 for Streamtape ([e11cf89](https://github.com/webstreamr/webstreamr/commit/e11cf8986ed0e33d2032624ccee9b15539ed3317))
* **extractor:** do not guess size from mp4 for Uqload ([5e1c3ee](https://github.com/webstreamr/webstreamr/commit/5e1c3eea24cf361f1fae63794338c54dda327dd4))


### Code Refactoring

* use .at() instead of .slice() construct ([22c6754](https://github.com/webstreamr/webstreamr/commit/22c6754efcccf97f478b45b35c053e9e85c17340))

## [0.54.2](https://github.com/webstreamr/webstreamr/compare/v0.54.1...v0.54.2) (2025-10-07)


### Bug Fixes

* **extractor:** do not pass referer for Uqload MFP requests ([298ac96](https://github.com/webstreamr/webstreamr/commit/298ac965588e7a1fbc830586309cdb60c5b9efdc))

## [0.54.1](https://github.com/webstreamr/webstreamr/compare/v0.54.0...v0.54.1) (2025-10-06)


### Miscellaneous Chores

* **deps:** update dependency cacheable to v2.1.0 ([#413](https://github.com/webstreamr/webstreamr/issues/413)) ([c19d46f](https://github.com/webstreamr/webstreamr/commit/c19d46f406b8f8b920da4ec1b3929f5e9d9a848b))
* **deps:** update dependency typescript-eslint to v8.46.0 ([#414](https://github.com/webstreamr/webstreamr/issues/414)) ([8b4aef9](https://github.com/webstreamr/webstreamr/commit/8b4aef94be8710e835503dc103979eee8dc1eb51))


### Bug Fixes

* **extractor:** handle another LuluStream file not found case ([d0958e8](https://github.com/webstreamr/webstreamr/commit/d0958e87714e3577f6e47cca2086806567ffaf8c))

## [0.54.0](https://github.com/webstreamr/webstreamr/compare/v0.53.7...v0.54.0) (2025-10-06)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#408](https://github.com/webstreamr/webstreamr/issues/408)) ([5a4f28e](https://github.com/webstreamr/webstreamr/commit/5a4f28e50a31d4bda361fb9f1aca0580dd803a26))
* **deps:** update dependency @types/node to v22.18.8 ([#407](https://github.com/webstreamr/webstreamr/issues/407)) ([f7bb497](https://github.com/webstreamr/webstreamr/commit/f7bb4974327a3fc91a51dd5d622b46bc4614af1c))
* **deps:** update eslint monorepo to v9.37.0 ([#404](https://github.com/webstreamr/webstreamr/issues/404)) ([b836040](https://github.com/webstreamr/webstreamr/commit/b8360405dd250bbc3682a3d7ab6defb53d07f27f))
* **extractor:** add FileLions domain ([78125c7](https://github.com/webstreamr/webstreamr/commit/78125c7f375b4a8ed69ea962cd9c9e2d6c6b4a11))
* **extractor:** add KinoGer domain ([c27c1f9](https://github.com/webstreamr/webstreamr/commit/c27c1f95417f408bd14bd8c7e33b52d3a8ab20f3))
* **extractor:** re-use and optimise mediaflow default fetch init slightly ([7191c59](https://github.com/webstreamr/webstreamr/commit/7191c59b8a9624e565a0b9e813d4a3833fa306ab))
* **extractor:** work around VidSrc blocking by generating random IPs ([c610a99](https://github.com/webstreamr/webstreamr/commit/c610a995c2e4b8f397f5b6af05b46695c3305453))


### Features

* **extractor:** add new MediaFlow Proxy extractors FileMoon, LuluStream and Voe ([bb21bbc](https://github.com/webstreamr/webstreamr/commit/bb21bbc7fa042b1dd2ebcceffe389dc28aa5753d))


### Bug Fixes

* **extractor:** handle FileLions Not Found case ([d1493cb](https://github.com/webstreamr/webstreamr/commit/d1493cbb579a6d02399b9bd28003f2aee6467844))
* **extractor:** handle StreamEmbed video is not ready ([424c2fd](https://github.com/webstreamr/webstreamr/commit/424c2fd1e0cf63438f5726de281cdf08a1aab46d))
* **extractor:** remove referer header from Mixdrop ([eea8cac](https://github.com/webstreamr/webstreamr/commit/eea8cac018aa99cc870ae4665d81e43c30af8904))
* **source:** use PrimeWire page instead of API as Referer ([30a709d](https://github.com/webstreamr/webstreamr/commit/30a709d6198f96e8d781fdab58421ca968931640))

## [0.53.7](https://github.com/webstreamr/webstreamr/compare/v0.53.6...v0.53.7) (2025-10-02)


### Bug Fixes

* **extractor:** bring back VixSrc language exclusion ([ac7d248](https://github.com/webstreamr/webstreamr/commit/ac7d2480eaaf2def02870e614f3854ce25af0889))

## [0.53.6](https://github.com/webstreamr/webstreamr/compare/v0.53.5...v0.53.6) (2025-10-02)


### Miscellaneous Chores

* **deps:** update dependency cacheable to v2.0.3 ([#400](https://github.com/webstreamr/webstreamr/issues/400)) ([390adea](https://github.com/webstreamr/webstreamr/commit/390adea9d4ed879bfdafdc61022249ccafcf8c60))
* **deps:** update dependency typescript to v5.9.3 ([#396](https://github.com/webstreamr/webstreamr/issues/396)) ([04069d8](https://github.com/webstreamr/webstreamr/commit/04069d83ea67a9f398ec1b50841ba462b07ed0d1))
* **deps:** update dependency winston to v3.18.3 ([#397](https://github.com/webstreamr/webstreamr/issues/397)) ([7e4657c](https://github.com/webstreamr/webstreamr/commit/7e4657c6adff9d4408de4c14604a636edb7f7c14))
* **extractor:** configure new VidSrc TLDs ([34b7fdd](https://github.com/webstreamr/webstreamr/commit/34b7fddfc733aed27626577f5edccef72fa9e934))
* **fetcher:** retry unexpected exceptions ([5ac359f](https://github.com/webstreamr/webstreamr/commit/5ac359f1ebbfa9489fa8e42720a9dda1e8fcd4a7))

## [0.53.5](https://github.com/webstreamr/webstreamr/compare/v0.53.4...v0.53.5) (2025-09-30)


### Miscellaneous Chores

* **deps:** update dependency winston to v3.18.2 ([#394](https://github.com/webstreamr/webstreamr/issues/394)) ([9f46b7f](https://github.com/webstreamr/webstreamr/commit/9f46b7fffa0b8ae82f117583c8485ec9ffc66aca))
* **extractor:** make VixSrc work without MediaFlow proxy ([012b164](https://github.com/webstreamr/webstreamr/commit/012b1648e1da1d8bf22a45d1787b0ca760f5260c))
* use concurrency of 4 for mediaflow proxy requests ([04b8987](https://github.com/webstreamr/webstreamr/commit/04b8987c3020138a00afddc99df8021626f188a2))

## [0.53.4](https://github.com/webstreamr/webstreamr/compare/v0.53.3...v0.53.4) (2025-09-30)


### Miscellaneous Chores

* **deps:** update dependency winston to v3.18.1 ([#392](https://github.com/webstreamr/webstreamr/issues/392)) ([c3721c4](https://github.com/webstreamr/webstreamr/commit/c3721c428e7fc6f4c15516bbfcafff29b754f026))
* **fetcher:** add generic fetch also returning response url ([5466472](https://github.com/webstreamr/webstreamr/commit/5466472b211b56e813c12577152f090378fbcd16))


### Bug Fixes

* **extractor:** handle Uqload File Not Found ([f0a66e1](https://github.com/webstreamr/webstreamr/commit/f0a66e19845a9b994f1f44cb3825e043f1697a51))
* **source:** dynamically determine MegaKino base URL ([d6fb4c9](https://github.com/webstreamr/webstreamr/commit/d6fb4c971b7b79f41e09ec2205831d5ac3ce7afc))

## [0.53.3](https://github.com/webstreamr/webstreamr/compare/v0.53.2...v0.53.3) (2025-09-29)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.45.0 ([#389](https://github.com/webstreamr/webstreamr/issues/389)) ([4bf2cf6](https://github.com/webstreamr/webstreamr/commit/4bf2cf632b9606bcb927e73a014da3bf993917ab))
* **source:** improve Eurostreaming search by trimming some special chars and supporting similarity search ([8f2e8e4](https://github.com/webstreamr/webstreamr/commit/8f2e8e492fafdadef510a5e8aa5a7c56a7bad79c))
* **source:** support similar match search in HomeCine ([e327f3c](https://github.com/webstreamr/webstreamr/commit/e327f3c7344ce5a8553eb14b5d578d3221b2c81b))
* **source:** use original title as search fallback in HomeCine and don't enforce year check ([20648ae](https://github.com/webstreamr/webstreamr/commit/20648ae4cdb5e1618268c579c34c51f7aa22bc1b))


### Tests

* fix slugger length check in FetcherMock ([0879531](https://github.com/webstreamr/webstreamr/commit/0879531478efbcff3eefaa14c362fabd0b905e36))

## [0.53.2](https://github.com/webstreamr/webstreamr/compare/v0.53.1...v0.53.2) (2025-09-29)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#385](https://github.com/webstreamr/webstreamr/issues/385)) ([6c44fcc](https://github.com/webstreamr/webstreamr/commit/6c44fccf665ed03190307102c13079d639bd64c0))


### Bug Fixes

* **source:** adapt MegaKino for new search ([fb689bf](https://github.com/webstreamr/webstreamr/commit/fb689bf7da89ca26127675bcb64c2a044d04d4e5))

## [0.53.1](https://github.com/webstreamr/webstreamr/compare/v0.53.0...v0.53.1) (2025-09-28)


### Miscellaneous Chores

* add referer explicitly to sources ([be7c19a](https://github.com/webstreamr/webstreamr/commit/be7c19a54f5df15966a4214b63611eff4753788e))
* bring back mediaflow proxy redirect url generation ([d8a4375](https://github.com/webstreamr/webstreamr/commit/d8a4375783a9ccd52b964c43e323c9b438575bca))
* **deps:** update jest monorepo to v30.2.0 ([#384](https://github.com/webstreamr/webstreamr/issues/384)) ([708d3d7](https://github.com/webstreamr/webstreamr/commit/708d3d785d0003e4c9cd0b6c4025215db558ab41))
* **fetcher:** add referer to fetch logging ([fcced2e](https://github.com/webstreamr/webstreamr/commit/fcced2e12274beeea498b8a42cda1c6a0952f6b1))
* rework referer header passing and mediaflow proxy URL creation ([25b326e](https://github.com/webstreamr/webstreamr/commit/25b326ee480a41d60c2430ad820036c6313cb4f3))


### Bug Fixes

* do not write out label twice if the same for source and extractor ([6053034](https://github.com/webstreamr/webstreamr/commit/60530343b4bd7cbaf8aa3c7812dee352691b4c82))
* **source:** improve Eurostream partial keyword matching ([af5c3f2](https://github.com/webstreamr/webstreamr/commit/af5c3f2ae62fe68daa1eed2ab97d799e056187bf))

## [0.53.0](https://github.com/webstreamr/webstreamr/compare/v0.52.5...v0.53.0) (2025-09-25)


### Miscellaneous Chores

* **deps:** update node.js to v22.20.0 ([#380](https://github.com/webstreamr/webstreamr/issues/380)) ([7760c13](https://github.com/webstreamr/webstreamr/commit/7760c13ea9ba12932ae7d8b58503f1509bf3b0c1))
* lock to latest node major only ([#382](https://github.com/webstreamr/webstreamr/issues/382)) ([0ff0758](https://github.com/webstreamr/webstreamr/commit/0ff0758b74772179e92852fae995314a17a50bb1))


### Features

* add source info ([1fb7d0c](https://github.com/webstreamr/webstreamr/commit/1fb7d0c66bef74f63560ac5b0d468afda17134e1))


### Bug Fixes

* **source:** use iframe src from API as referer for Movix ([ae34284](https://github.com/webstreamr/webstreamr/commit/ae342845f8934e7bb99cd035122cb3636e321e88))

## [0.52.5](https://github.com/webstreamr/webstreamr/compare/v0.52.4...v0.52.5) (2025-09-24)


### Miscellaneous Chores

* add web emoji as icon ([b124408](https://github.com/webstreamr/webstreamr/commit/b1244086cddf28995f2724b15b4aed2d3d5f5087))
* **extractor:** add DoodStream host ([da556d3](https://github.com/webstreamr/webstreamr/commit/da556d3523ff475ba37071a86638672e14503732))
* **extractor:** add FileLions domain ([6f412d7](https://github.com/webstreamr/webstreamr/commit/6f412d736b94f2f2fa458e4e7df9c0916495dd37))
* **fetcher:** double queue limit and timeouts ([4697d15](https://github.com/webstreamr/webstreamr/commit/4697d150cf1cf541895e7a1bd5e3c233fd8c9401))


### Bug Fixes

* always move errors up and external urls down ([ddc8133](https://github.com/webstreamr/webstreamr/commit/ddc8133c5b923c8caac327f2e68cfeb2bd087cc6))
* prefer using source referer for extractors if it exists ([42d46ac](https://github.com/webstreamr/webstreamr/commit/42d46accb6be3e7995e4d60cb3ec39ff13e07e14))
* **source:** set correct referer for Movix ([6214df7](https://github.com/webstreamr/webstreamr/commit/6214df7e8ff6119079bf54f4e51df69e21bf6575))


### Code Refactoring

* **fetcher:** introduce json method ([a96d015](https://github.com/webstreamr/webstreamr/commit/a96d015a0c6ceb57812ebf3293e6a3cdf44edb0a))

## [0.52.4](https://github.com/webstreamr/webstreamr/compare/v0.52.3...v0.52.4) (2025-09-23)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#374](https://github.com/webstreamr/webstreamr/issues/374)) ([1a2b40d](https://github.com/webstreamr/webstreamr/commit/1a2b40d6f27a5c16dd5c4f9f6a1632d5ae4d5bc3))
* **deps:** update dependency @stylistic/eslint-plugin to v5.4.0 ([#371](https://github.com/webstreamr/webstreamr/issues/371)) ([953a791](https://github.com/webstreamr/webstreamr/commit/953a7914c92c60124cd629d28de08787696a1273))
* **deps:** update dependency @types/node to v22.18.6 ([#373](https://github.com/webstreamr/webstreamr/issues/373)) ([b7714d7](https://github.com/webstreamr/webstreamr/commit/b7714d7d604d427c3d6088ea245c4728bfa5b5ea))
* **deps:** update dependency ts-jest to v29.4.4 ([#368](https://github.com/webstreamr/webstreamr/issues/368)) ([48b0924](https://github.com/webstreamr/webstreamr/commit/48b0924bd8cd0ebbe47a52aaaa9bef6b931b110b))
* **deps:** update dependency typescript-eslint to v8.44.1 ([#376](https://github.com/webstreamr/webstreamr/issues/376)) ([9709c31](https://github.com/webstreamr/webstreamr/commit/9709c31bcdd140e5fd638dfee5e3a595b8b800be))
* **deps:** update eslint monorepo to v9.36.0 ([#369](https://github.com/webstreamr/webstreamr/issues/369)) ([092d53e](https://github.com/webstreamr/webstreamr/commit/092d53ef9dffb9f1db2e2f90666b8439daf19321))
* **fetcher:** complete proxy headers ([0a0beda](https://github.com/webstreamr/webstreamr/commit/0a0bedacb485d1524abeb870dda78cf4cde01341))
* remove XPrime ([6d5a511](https://github.com/webstreamr/webstreamr/commit/6d5a511cb4d2e778debcfcba3bc4de7b30913663))


### Bug Fixes

* **deps:** update dependency cacheable to v2.0.2 ([#377](https://github.com/webstreamr/webstreamr/issues/377)) ([2e3b660](https://github.com/webstreamr/webstreamr/commit/2e3b6602af0d671fc1124a3b5cc2f4e41b47f176))


### Reverts

* Revert "chore(fetcher): try to remove the proxy headers (again)" ([7e771c2](https://github.com/webstreamr/webstreamr/commit/7e771c2644dc2016e8d4b632a3436f6b24d2f126))

## [0.52.3](https://github.com/webstreamr/webstreamr/compare/v0.52.2...v0.52.3) (2025-09-18)


### Miscellaneous Chores

* **deps:** update dependency ts-jest to v29.4.3 ([#365](https://github.com/webstreamr/webstreamr/issues/365)) ([833c487](https://github.com/webstreamr/webstreamr/commit/833c4870f8b729f8ff099b0aa8238915d612ab07))


### Bug Fixes

* **deps:** update dependency cacheable to v2.0.1 ([#364](https://github.com/webstreamr/webstreamr/issues/364)) ([f9d8dc0](https://github.com/webstreamr/webstreamr/commit/f9d8dc0b8620d5c9825164b7a404642ff23ba991))
* **source:** improve 4KHDHub year and title matching ([a30b271](https://github.com/webstreamr/webstreamr/commit/a30b271a578ff85cf31b3911bfc6aea2da0773a0))


### Reverts

* Revert "fix: remove turnstyle detection to check if it causes false-positives" ([60f44c9](https://github.com/webstreamr/webstreamr/commit/60f44c9603cba4266f9ea33e8558da4c101d01f1))

## [0.52.2](https://github.com/webstreamr/webstreamr/compare/v0.52.1...v0.52.2) (2025-09-16)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#359](https://github.com/webstreamr/webstreamr/issues/359)) ([1028c66](https://github.com/webstreamr/webstreamr/commit/1028c663ebcbbff64d114efc654f5f817cbce40d))
* **deps:** update dependency @types/node to v22.18.3 ([#358](https://github.com/webstreamr/webstreamr/issues/358)) ([e33aa42](https://github.com/webstreamr/webstreamr/commit/e33aa42b1954d4a4f79f0d779a168af46c15c3e8))
* **deps:** update dependency ts-jest to v29.4.2 ([#361](https://github.com/webstreamr/webstreamr/issues/361)) ([6ef80d3](https://github.com/webstreamr/webstreamr/commit/6ef80d3166d6f01462b03f2a830e4956cbef1661))
* **deps:** update dependency typescript-eslint to v8.44.0 ([#362](https://github.com/webstreamr/webstreamr/issues/362)) ([261897c](https://github.com/webstreamr/webstreamr/commit/261897c6990ba7a8799637bc5a525dc6fac7e7c3))


### Bug Fixes

* do not return cache headers when noCache is set ([d06c293](https://github.com/webstreamr/webstreamr/commit/d06c2934a8114bf3c8b186604f8988288671fce9))
* **extractor:** filter out non-accessible HubCloud streams ([c819dd6](https://github.com/webstreamr/webstreamr/commit/c819dd6bb7bca4da7ec40df10ba666fa7735df1c))
* **extractor:** normalize Streamtape URLs ([aeb7ce5](https://github.com/webstreamr/webstreamr/commit/aeb7ce5f541e6d051b0eb945ccfb7f1675dbf469))
* **fetcher:** only retry 503 and 504 ([d90cd8f](https://github.com/webstreamr/webstreamr/commit/d90cd8f98454318b77003cecaf3101ae42d1a569))
* remove turnstyle detection to check if it causes false-positives ([c10ca29](https://github.com/webstreamr/webstreamr/commit/c10ca29fda84aafc34914889b198e5ae6fca4063))

## [0.52.1](https://github.com/webstreamr/webstreamr/compare/v0.52.0...v0.52.1) (2025-09-14)


### Bug Fixes

* **source:** re-implement PrimeWire in safer and more efficient way ([f4d9058](https://github.com/webstreamr/webstreamr/commit/f4d905833f102372bcb7b2f91531aa247ffc47d9))

## [0.52.0](https://github.com/webstreamr/webstreamr/compare/v0.51.2...v0.52.0) (2025-09-14)


### Features

* allow to disable extractors via env var ([737bf6a](https://github.com/webstreamr/webstreamr/commit/737bf6aa94fabeac0d33c39fc0e4a9ceabbcdcc9))
* allow to disable sources via env var ([f89d906](https://github.com/webstreamr/webstreamr/commit/f89d90619ad2d7ce64e0bba2d1278e221956fa25))

## [0.51.2](https://github.com/webstreamr/webstreamr/compare/v0.51.1...v0.51.2) (2025-09-14)


### Bug Fixes

* **fetcher:** re-use proxy agents ([ae32376](https://github.com/webstreamr/webstreamr/commit/ae323767582a41f5a0b9d6f1c5b14211dbfc83f2))
* log more infos for uncaught errors ([8b479be](https://github.com/webstreamr/webstreamr/commit/8b479be6c5e2530e445d9b9c71d02078a5600feb))
* **source:** close jsdom window immediately after getting HTML ([aded562](https://github.com/webstreamr/webstreamr/commit/aded5623042d06510245b846c58f6ac939d0e76b))


### Reverts

* Revert recent reverts again ([8acbd37](https://github.com/webstreamr/webstreamr/commit/8acbd37df30eb61ea6c5df186b6e8752cbf7b836))

## [0.51.1](https://github.com/webstreamr/webstreamr/compare/v0.51.0...v0.51.1) (2025-09-14)


### Bug Fixes

* **deps:** update dependency jsdom to v27 ([#350](https://github.com/webstreamr/webstreamr/issues/350)) ([58b50b4](https://github.com/webstreamr/webstreamr/commit/58b50b49de7ca0aa74e507c0b8c840b578c354ab))


### Reverts

* Revert "chore: log error count in final result log" ([2aa9ad2](https://github.com/webstreamr/webstreamr/commit/2aa9ad270eec65ab275a076e8c009d78cc16ac00))
* Revert "chore(fetcher): log more infos about responses" ([78db179](https://github.com/webstreamr/webstreamr/commit/78db17995752ba286d69782b9014d61ef51f2740))
* Revert "chore(fetcher): log proxy usage, allow to disable proxy via config" ([4ca87f0](https://github.com/webstreamr/webstreamr/commit/4ca87f0ff1789755e412f6bb3151a2c2d76d5121))
* Revert "feat: allow to disable cache" ([9a279b5](https://github.com/webstreamr/webstreamr/commit/9a279b53a4b8d7275a54e32e5151fa85a13d0530))
* Revert "fix(deps): update dependency jsdom to v27 ([#350](https://github.com/webstreamr/webstreamr/issues/350))" ([dc610bf](https://github.com/webstreamr/webstreamr/commit/dc610bfa64428e9231c112e16669ef9572589474))

## [0.51.0](https://github.com/webstreamr/webstreamr/compare/v0.50.4...v0.51.0) (2025-09-13)


### Miscellaneous Chores

* **fetcher:** log more infos about responses ([731bd33](https://github.com/webstreamr/webstreamr/commit/731bd334703f0592f083d4264c382c28acf68eb1))
* **fetcher:** log proxy usage, allow to disable proxy via config ([b67e1b8](https://github.com/webstreamr/webstreamr/commit/b67e1b85d634be413e004625b13403acc445ce72))
* log error count in final result log ([2421913](https://github.com/webstreamr/webstreamr/commit/24219135874be6cdecdb95cabfed86ad60d6c451))


### Features

* allow to disable cache ([4078f0c](https://github.com/webstreamr/webstreamr/commit/4078f0c404a76f4c5a3c12ec74108d3d03840e34))


### Reverts

* Revert "fix(extractor): use SuperVideo embed URls which are not triggering CF challenges" ([4351ddc](https://github.com/webstreamr/webstreamr/commit/4351ddc00dc349bde60968dc1490359e4720f924))

## [0.50.4](https://github.com/webstreamr/webstreamr/compare/v0.50.3...v0.50.4) (2025-09-12)


### Miscellaneous Chores

* add url info to blocked error ([a729dc8](https://github.com/webstreamr/webstreamr/commit/a729dc85e0231a15dac2c28c3c198ec4e3269ea8))

## [0.50.3](https://github.com/webstreamr/webstreamr/compare/v0.50.2...v0.50.3) (2025-09-12)


### Miscellaneous Chores

* **extractor:** set VidSrc referer again ([5429b0c](https://github.com/webstreamr/webstreamr/commit/5429b0cb7a2e2bb419158bc0df659cb9002ac345))
* **fetcher:** bring back error retry ([69da82b](https://github.com/webstreamr/webstreamr/commit/69da82b139d952f09aa5e1b1a51c887223fd20db))
* **fetcher:** cache only 2xx and 404 responses ([d087318](https://github.com/webstreamr/webstreamr/commit/d087318286a32a82eb5bb211fad8aba0eeba257e))
* slightly clean-up extractor and source logging ([fdb9bff](https://github.com/webstreamr/webstreamr/commit/fdb9bff86bfb9869e8b2bdbff10d994667e1bb85))
* **source:** disable Soaper ([cb256de](https://github.com/webstreamr/webstreamr/commit/cb256de9f8f9d7e40f76c86af1c2c21efec7dc70))


### Bug Fixes

* **extractor:** cache FileLions ([b27126f](https://github.com/webstreamr/webstreamr/commit/b27126fd8e41bfdc344fb4e448c1f87844837a9e))

## [0.50.2](https://github.com/webstreamr/webstreamr/compare/v0.50.1...v0.50.2) (2025-09-12)


### Miscellaneous Chores

* **fetcher:** switch back to undici fetch 🤡 ([2a47d97](https://github.com/webstreamr/webstreamr/commit/2a47d97d5cda5526775ed2d60b99bfdfc76fd6d0))

## [0.50.1](https://github.com/webstreamr/webstreamr/compare/v0.50.0...v0.50.1) (2025-09-12)


### Miscellaneous Chores

* **fetcher:** remove interceptors and retries ([7ee87ce](https://github.com/webstreamr/webstreamr/commit/7ee87ceb9ea38876bed7e3ea034c6f60bfdd9a27))

## [0.50.0](https://github.com/webstreamr/webstreamr/compare/v0.49.7...v0.50.0) (2025-09-12)


### Miscellaneous Chores

* **extractor:** remove Referer from follow-up VidSrc requests completely ([ffd62a5](https://github.com/webstreamr/webstreamr/commit/ffd62a5d160266f168422bf5d3f66e374f8ac140))


### Features

* add support for proxy per host using minimatch ([b513a89](https://github.com/webstreamr/webstreamr/commit/b513a8926bec22ea47053551445ebbad5ab6ecd9))


### Code Refactoring

* create dispatcher per request ([2f370d1](https://github.com/webstreamr/webstreamr/commit/2f370d1b9c20aa3cc51a9c59852a0768949a3afa))

## [0.49.7](https://github.com/webstreamr/webstreamr/compare/v0.49.6...v0.49.7) (2025-09-11)


### Miscellaneous Chores

* **fetcher:** switch back to native fetch 🤡 ([8789381](https://github.com/webstreamr/webstreamr/commit/87893819b08fa48a76a833638ff5ee909aef8bcb))

## [0.49.6](https://github.com/webstreamr/webstreamr/compare/v0.49.5...v0.49.6) (2025-09-11)


### Bug Fixes

* **extractor:** do not pass Referer for cloudnestra requests ([98c53a1](https://github.com/webstreamr/webstreamr/commit/98c53a15f2aec54f88441369f50c1e27d14b0ce4))

## [0.49.5](https://github.com/webstreamr/webstreamr/compare/v0.49.4...v0.49.5) (2025-09-10)


### Miscellaneous Chores

* include imdb and tmdb IDs in XPrime requests ([7f264b2](https://github.com/webstreamr/webstreamr/commit/7f264b250303db90565bf7a1dd65e363df07f43a))

## [0.49.4](https://github.com/webstreamr/webstreamr/compare/v0.49.3...v0.49.4) (2025-09-10)


### Bug Fixes

* **extractor:** use correct xprime referer ([531ad75](https://github.com/webstreamr/webstreamr/commit/531ad7562ae20eaa8b1c17e49498e1beebc4cc8c))

## [0.49.3](https://github.com/webstreamr/webstreamr/compare/v0.49.2...v0.49.3) (2025-09-10)


### Miscellaneous Chores

* **extractor:** clean-up header/referer passing ([057b234](https://github.com/webstreamr/webstreamr/commit/057b2346dc480963f74836554fca2028329857c5))


### Bug Fixes

* **extractor:** improve messy meta type ([7f2cf10](https://github.com/webstreamr/webstreamr/commit/7f2cf10021b59dc621f12cf82a431c30afab1f76))

## [0.49.2](https://github.com/webstreamr/webstreamr/compare/v0.49.1...v0.49.2) (2025-09-10)


### Miscellaneous Chores

* **fetcher:** try to remove the proxy headers (again) ([00bd114](https://github.com/webstreamr/webstreamr/commit/00bd11495fbabcf383980c351ae802d64cfd8f19))

## [0.49.1](https://github.com/webstreamr/webstreamr/compare/v0.49.0...v0.49.1) (2025-09-10)


### Bug Fixes

* **deps:** update dependency cacheable to v2 ([#336](https://github.com/webstreamr/webstreamr/issues/336)) ([8b55889](https://github.com/webstreamr/webstreamr/commit/8b5588936e2316370b3615d0aaf0e4efd3357252))
* **deps:** update dependency undici to v7.16.0 ([#335](https://github.com/webstreamr/webstreamr/issues/335)) ([78a83c5](https://github.com/webstreamr/webstreamr/commit/78a83c536e3423efd7349728f688bf39be73a723))
* **extractor:** grab VixSrc height from playlist ([c5da7c1](https://github.com/webstreamr/webstreamr/commit/c5da7c19976c16505441c792554aee2f3d20ec39))
* **extractor:** use SuperVideo embed URls which are not triggering CF challenges ([3a2178e](https://github.com/webstreamr/webstreamr/commit/3a2178eb55880ad254a691a5043012790b268c55))

## [0.49.0](https://github.com/webstreamr/webstreamr/compare/v0.48.0...v0.49.0) (2025-09-09)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.43.0 ([#333](https://github.com/webstreamr/webstreamr/issues/333)) ([0bfced5](https://github.com/webstreamr/webstreamr/commit/0bfced503c9476dce739ee569978bf16baac2b33))


### Features

* **extractor:** add FileLions extractor ([8430e5d](https://github.com/webstreamr/webstreamr/commit/8430e5d0d1ceb30d267090cc3e1409b9e9773180))

## [0.48.0](https://github.com/webstreamr/webstreamr/compare/v0.47.2...v0.48.0) (2025-09-08)


### Features

* **extractor:** support PixelServer in HubCloud ([39850dc](https://github.com/webstreamr/webstreamr/commit/39850dccf70a2bae1355e6c3018931457cefd382))

## [0.47.2](https://github.com/webstreamr/webstreamr/compare/v0.47.1...v0.47.2) (2025-09-08)


### Bug Fixes

* **extractor:** find more FSL links ([6823236](https://github.com/webstreamr/webstreamr/commit/68232363ae0accc8f4920929ba02e7d1ee55fb83))

## [0.47.1](https://github.com/webstreamr/webstreamr/compare/v0.47.0...v0.47.1) (2025-09-08)


### Miscellaneous Chores

* add Norwegian, sort language list ([6577eda](https://github.com/webstreamr/webstreamr/commit/6577eda289770995b835de17fad3cbfd702af6e8))


### Bug Fixes

* **source:** handle missing 4KHDHub episodes more gracefully ([c2983f0](https://github.com/webstreamr/webstreamr/commit/c2983f0551faff525217fbd45f9791a86205cb43))

## [0.47.0](https://github.com/webstreamr/webstreamr/compare/v0.46.5...v0.47.0) (2025-09-08)


### Miscellaneous Chores

* add infos about sources and extractors to description ([3b8481e](https://github.com/webstreamr/webstreamr/commit/3b8481ed3fe11f64bc73e3a90bd6932da2cf6c96))
* add more details to /live / ipcheck endpoint, add cloudnestra ([9f15a03](https://github.com/webstreamr/webstreamr/commit/9f15a03a5a5293a7d6dd14e7d86d4c7d119e63be))
* configure a bunch of more language mappings ([b60f91a](https://github.com/webstreamr/webstreamr/commit/b60f91a96a1dcb83085372b3cc36cf50fb6b4f96))
* **deps:** lock file maintenance ([#329](https://github.com/webstreamr/webstreamr/issues/329)) ([224b241](https://github.com/webstreamr/webstreamr/commit/224b241cd6874d95cec4923ff2add051ef582eaf))
* **deps:** update dependency @types/node to v22.18.1 ([#328](https://github.com/webstreamr/webstreamr/issues/328)) ([907a150](https://github.com/webstreamr/webstreamr/commit/907a150574baa8d765ccede10c8b19eea0710755))
* **deps:** update eslint monorepo to v9.35.0 ([#324](https://github.com/webstreamr/webstreamr/issues/324)) ([5598399](https://github.com/webstreamr/webstreamr/commit/55983990fb3c3f404545ba6d18ca23bb7f94ae31))
* drop uuid in favor of node:crypto randomUUID ([3380185](https://github.com/webstreamr/webstreamr/commit/33801854495d9968847fc2a96f797866f5166967))
* **tmdb:** use mutex to avoid double tmdb requests ([e1b5e7b](https://github.com/webstreamr/webstreamr/commit/e1b5e7bce169bd78d2883c0d8e004504845b08a6))


### Features

* **extractor:** add HubCloud with FSL ([1ecb088](https://github.com/webstreamr/webstreamr/commit/1ecb088b607f6b961bfb69889f02d7db8aee3a45))
* **source:** add 4KHDHub ([8a1645f](https://github.com/webstreamr/webstreamr/commit/8a1645fb81afd314db724ead699aa98d7e211e65))


### Bug Fixes

* **extractor:** gracefully handle deleted files for SaveFiles ([48c7735](https://github.com/webstreamr/webstreamr/commit/48c773516521bac37ed8218df5544bdd9228a8f5))

## [0.46.5](https://github.com/webstreamr/webstreamr/compare/v0.46.4...v0.46.5) (2025-09-05)


### Miscellaneous Chores

* **extractor:** do only one VidSrc request per domain at a time ([b589c25](https://github.com/webstreamr/webstreamr/commit/b589c25bb543a59e84e2f89bc248b0ef7f5fbe0c))
* **fetcher:** wait out short rate limits and retry ([211babe](https://github.com/webstreamr/webstreamr/commit/211babec3767543728f5a9ba5c75d61c57700167))


### Bug Fixes

* **fetcher:** fix TTL for rate limit cache ([e846900](https://github.com/webstreamr/webstreamr/commit/e8469003845b1af32236d480af72748fdd24fb72))

## [0.46.4](https://github.com/webstreamr/webstreamr/compare/v0.46.3...v0.46.4) (2025-09-04)


### Miscellaneous Chores

* **source:** retry also blocking errors with different VidSrc TLD ([af4d001](https://github.com/webstreamr/webstreamr/commit/af4d0010fb47c983931003efcd80b4c115175bd9))

## [0.46.3](https://github.com/webstreamr/webstreamr/compare/v0.46.2...v0.46.3) (2025-09-04)


### Miscellaneous Chores

* allow forcing the IP check in the /live endpoint ([cf79473](https://github.com/webstreamr/webstreamr/commit/cf79473fad96dbac083522646dfcc1018fcc075c))

## [0.46.2](https://github.com/webstreamr/webstreamr/compare/v0.46.1...v0.46.2) (2025-09-04)


### Miscellaneous Chores

* **deps:** update actions/setup-node action to v5 ([#320](https://github.com/webstreamr/webstreamr/issues/320)) ([139cb64](https://github.com/webstreamr/webstreamr/commit/139cb64ca54911691eee95002a3ab1994bcb8c15))


### Bug Fixes

* **extractor:** remove non-working VidSrc pm TLD ([ad7e480](https://github.com/webstreamr/webstreamr/commit/ad7e4802132dd2e6a143a1a3137d7f4bd17150f2))
* **source:** VixSrc is not an English source ([4002301](https://github.com/webstreamr/webstreamr/commit/4002301fa62e6b89d9f38015e06505ee59cf4abf))


### Code Refactoring

* simplify passing around meta ([cfcf81b](https://github.com/webstreamr/webstreamr/commit/cfcf81b665357afb559afe569ef719f943438d48))

## [0.46.1](https://github.com/webstreamr/webstreamr/compare/v0.46.0...v0.46.1) (2025-09-03)


### Miscellaneous Chores

* decrease fetcher and extractor memory cache sizes ([756cd01](https://github.com/webstreamr/webstreamr/commit/756cd01ab910cef167bc78c2bf895c2cf992677d))

## [0.46.0](https://github.com/webstreamr/webstreamr/compare/v0.45.3...v0.46.0) (2025-09-03)


### Miscellaneous Chores

* add ipStatus to /live endpoint ([94abcd3](https://github.com/webstreamr/webstreamr/commit/94abcd3f0ae814d2e057e14c7e5cbc96822c6803))
* **fetcher:** decrease timeout to 5 seconds ([83021fb](https://github.com/webstreamr/webstreamr/commit/83021fb773e87711b812e327c4dec003fb27eb01))
* no special sorting for errors ([12ac42e](https://github.com/webstreamr/webstreamr/commit/12ac42ef5f67c20be2fedfb0dea9183504529663))


### Features

* add stats endpoint with cache stats ([fd0900e](https://github.com/webstreamr/webstreamr/commit/fd0900e0533ad2f56a1546f55f1e92a48c366b2e))
* configure sqlite as secondary source and extractor cache ([2b7e9c4](https://github.com/webstreamr/webstreamr/commit/2b7e9c403d646bde10c30e4eb48d55815b1aacff))
* **source:** persist PrimeWire redirect URL cache ([8979060](https://github.com/webstreamr/webstreamr/commit/89790609db3a24274b0b9f8ef39478f81657da4c))


### Bug Fixes

* **source:** make cache prop static ([5ea34f6](https://github.com/webstreamr/webstreamr/commit/5ea34f66dd5106112eae792e657af51513064df4))
* **source:** move countryCode filtering into central place ([5547fd5](https://github.com/webstreamr/webstreamr/commit/5547fd5486e61a260a208e343f837bd06978cd26))

## [0.45.3](https://github.com/webstreamr/webstreamr/compare/v0.45.2...v0.45.3) (2025-09-02)


### Miscellaneous Chores

* always return integers for Cache-Control max-age ([1b89cad](https://github.com/webstreamr/webstreamr/commit/1b89cadab5b36cd86895df46d6b54e757cfd4df5))
* **deps:** update dependency jest to v30.1.3 ([#314](https://github.com/webstreamr/webstreamr/issues/314)) ([896ec74](https://github.com/webstreamr/webstreamr/commit/896ec74959363ace6158098f241b17a9d21f90b5))
* **deps:** update dependency typescript-eslint to v8.42.0 ([#312](https://github.com/webstreamr/webstreamr/issues/312)) ([50764b3](https://github.com/webstreamr/webstreamr/commit/50764b3602039f3911da4b5586efb0d37fe1a287))
* **extractor:** cache Doodstream for 6h ([a250440](https://github.com/webstreamr/webstreamr/commit/a250440670501aefefac96d36c978111ff11f367))
* **extractor:** cache Dropload for 3h ([ccf8006](https://github.com/webstreamr/webstreamr/commit/ccf8006f1368e36a8431e7f2a5f9c768ee612fe2))
* **extractor:** cache ExternalUrl for 6h ([41aacf8](https://github.com/webstreamr/webstreamr/commit/41aacf84db79b1152e2b30cb8be1bb726bd23560))
* **extractor:** cache KinoGer for 6h ([316fd46](https://github.com/webstreamr/webstreamr/commit/316fd4621b65061c2023caa8e592167bc8faac0e))
* **extractor:** cache SaveFiles for 6h ([bb95118](https://github.com/webstreamr/webstreamr/commit/bb95118d2ba7f96ab830b42c6711696b07eae770))
* **extractor:** cache Soaper for 12h ([1e100e6](https://github.com/webstreamr/webstreamr/commit/1e100e6d2e3d42cba87800c31176a0811065387f))
* **extractor:** cache SuperVideo for 3h ([7ac7183](https://github.com/webstreamr/webstreamr/commit/7ac71837b35a40a3c5033ee5176437abaed3e5c9))
* **extractor:** cache VidSrc for 3h ([c68570d](https://github.com/webstreamr/webstreamr/commit/c68570d2bc9469623a0ec2a801c421810b90c06b))
* **extractor:** cache XPrime for 6h ([fc17545](https://github.com/webstreamr/webstreamr/commit/fc17545860b1d10602009c587506be98ed669b4f))
* **extractor:** cache YouTube for 6h ([8330431](https://github.com/webstreamr/webstreamr/commit/833043143fcff2f190b17b55cdc82a5f3b2a95a0))
* **extractor:** start refreshing results randomly after at least 2/3 of the TTL passed ([969ab8d](https://github.com/webstreamr/webstreamr/commit/969ab8d0d77390ff3cd7757645978ac3355c92ae))
* **source:** cache sources for 12h ([bc06cb5](https://github.com/webstreamr/webstreamr/commit/bc06cb5750f59f183e8796024f0abd843c01486a))


### Code Refactoring

* consistently use `cacheable` for caching ([dc093f7](https://github.com/webstreamr/webstreamr/commit/dc093f7109198db095900ed77f13c1d146df366f))

## [0.45.2](https://github.com/webstreamr/webstreamr/compare/v0.45.1...v0.45.2) (2025-09-01)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5.3.1 ([#309](https://github.com/webstreamr/webstreamr/issues/309)) ([285746a](https://github.com/webstreamr/webstreamr/commit/285746a4a9ba62ed17f30306f3e57ec0e8bb5f39))
* handle NotFoundError / 404 inside source and cache it also ([4d05ac8](https://github.com/webstreamr/webstreamr/commit/4d05ac859f14ccdd123f13d7c46fea6195e17a93))
* **source:** remove outdated comment ([2468fbd](https://github.com/webstreamr/webstreamr/commit/2468fbde4e826f4e313e202a1a2cdace655b7706))


### Bug Fixes

* catch all timeouts ([b47a512](https://github.com/webstreamr/webstreamr/commit/b47a5125870c7bd764756f38e4493e0e5b894b55))
* **source:** consider season and episode for cache key ([ceb520d](https://github.com/webstreamr/webstreamr/commit/ceb520d49d0c9ff3056fce32075b201499805fcf))


### Code Refactoring

* move locks into StreamController ([e109637](https://github.com/webstreamr/webstreamr/commit/e109637e48cdf4b2c1418fa00c30cf95268fbf0e))

## [0.45.1](https://github.com/webstreamr/webstreamr/compare/v0.45.0...v0.45.1) (2025-09-01)


### Miscellaneous Chores

* **deps:** update jest monorepo to v30.1.2 ([#308](https://github.com/webstreamr/webstreamr/issues/308)) ([4414324](https://github.com/webstreamr/webstreamr/commit/4414324a08197671ab2360d648c14d06b5792447))
* **deps:** update node.js to v22.19.0 ([#306](https://github.com/webstreamr/webstreamr/issues/306)) ([3044e41](https://github.com/webstreamr/webstreamr/commit/3044e41d9b3e4c3e3df94a51e549dc51886ae087))
* **extractor:** support caching via MediaFlow Proxy ([c556d95](https://github.com/webstreamr/webstreamr/commit/c556d9500b99ece8f1c83402f35ba2516796d8bc))
* **fetcher:** log retries ([c47f48c](https://github.com/webstreamr/webstreamr/commit/c47f48c64bf89f91d5ed0b8d2a25b1665733c82d))
* **fetcher:** retry timeouts once ([0fc7675](https://github.com/webstreamr/webstreamr/commit/0fc76755606d235efa2f963c7460815a726816df))
* **source:** cache source results for 3 hours ([c82a7ab](https://github.com/webstreamr/webstreamr/commit/c82a7ab75675b8fe45912febd5bf69a1cd3d2e23))


### Bug Fixes

* **extractor:** set missing viaMediaFlowProxy in Streamtape ([33ee150](https://github.com/webstreamr/webstreamr/commit/33ee150915f6cc3e07c14b26182b3ac99c379e6c))


### Code Refactoring

* **source:** introduce abstract parent class ([9da7c07](https://github.com/webstreamr/webstreamr/commit/9da7c07dc6350910d6ef30b24033fdcefc480a06))


### Tests

* disable console logging to reduce noise ([3c4507b](https://github.com/webstreamr/webstreamr/commit/3c4507b1981d284baf3058f9ca761eae5342b03e))

## [0.45.0](https://github.com/webstreamr/webstreamr/compare/v0.44.1...v0.45.0) (2025-08-28)


### Miscellaneous Chores

* configure undici dispatcher allowing HTTP2, caching DNS and retrying connection errors ([05d11e3](https://github.com/webstreamr/webstreamr/commit/05d11e366b39f4f6fe6c81cd85c58a4aef6d8203))
* **deps:** lock file maintenance ([#300](https://github.com/webstreamr/webstreamr/issues/300)) ([2381a2c](https://github.com/webstreamr/webstreamr/commit/2381a2c2adc47fbf23e1f006ff1edda5a6e54116))
* **deps:** update dependency typescript-eslint to v8.40.0 ([#292](https://github.com/webstreamr/webstreamr/issues/292)) ([14da5da](https://github.com/webstreamr/webstreamr/commit/14da5da205e4b49cc87dbd55b97a91ac3d90c89a))
* **deps:** update dependency typescript-eslint to v8.41.0 ([#302](https://github.com/webstreamr/webstreamr/issues/302)) ([0449150](https://github.com/webstreamr/webstreamr/commit/0449150874b478d6626f2ed0df5809e88317a0c6))
* **deps:** update eslint monorepo to v9.34.0 ([#298](https://github.com/webstreamr/webstreamr/issues/298)) ([b616fef](https://github.com/webstreamr/webstreamr/commit/b616fef018c0d4b99685ac729695a9773100008d))
* **deps:** update jest monorepo to v30.1.0 ([#304](https://github.com/webstreamr/webstreamr/issues/304)) ([b4dca46](https://github.com/webstreamr/webstreamr/commit/b4dca46e5e670919dc02d8904f0b24309c0e2394))
* **deps:** update jest monorepo to v30.1.1 ([#305](https://github.com/webstreamr/webstreamr/issues/305)) ([ada3ff1](https://github.com/webstreamr/webstreamr/commit/ada3ff19269e70013e0c11ff336f6b3d0f22c49f))
* **extractor:** add more KinoGer domains ([c8cd2ec](https://github.com/webstreamr/webstreamr/commit/c8cd2ec7943830b2691cdbf7f3c29658a1945b86))
* **extractor:** add more KinoGer domains and determine resolution ([2d9f9bf](https://github.com/webstreamr/webstreamr/commit/2d9f9bf1af22502608942c6aee8a8a37670b1eb2))
* **extractor:** move Fetcher into parent, guess missing heights for SuperVideo ([cefc80f](https://github.com/webstreamr/webstreamr/commit/cefc80fa5506b928adfa53eddc4351a597b0dbf3))
* **extractor:** use guessSizeFromMp4 in Streamtape, Uqload and XPrime ([18d8ee6](https://github.com/webstreamr/webstreamr/commit/18d8ee6b79967fc7719272f38abfcbfa1d1c1252))


### Features

* **source:** add Einschalten ([b6a8e6f](https://github.com/webstreamr/webstreamr/commit/b6a8e6f448c30dd91e3ac3ea624e4e01c8e4ac2b))
* support TMDB IDs ([c7c2ebf](https://github.com/webstreamr/webstreamr/commit/c7c2ebf353287763d2af83e1adc0943494806822))


### Bug Fixes

* **deps:** update dependency undici to v7.15.0 ([#297](https://github.com/webstreamr/webstreamr/issues/297)) ([41b4425](https://github.com/webstreamr/webstreamr/commit/41b44252b1274b3ed489c87172cc784441ede2a7))
* **extractor:** handle SaveFiles /d/ links properly ([eecd325](https://github.com/webstreamr/webstreamr/commit/eecd3255f0be0e11e551933771d2c3d4c5121654))


### Code Refactoring

* introduce guessSizeFromMp4 ([4a1a3b1](https://github.com/webstreamr/webstreamr/commit/4a1a3b19aac292256adc92d4d4b17e16e21dadec))


### Reverts

* Revert "chore(source): disable Soaper" ([795c033](https://github.com/webstreamr/webstreamr/commit/795c033a82f5d8e48a7b3e52d943352cac2a6535))

## [0.44.1](https://github.com/webstreamr/webstreamr/compare/v0.44.0...v0.44.1) (2025-08-18)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#290](https://github.com/webstreamr/webstreamr/issues/290)) ([747ea84](https://github.com/webstreamr/webstreamr/commit/747ea84880e8f88ac74c77fe6cd2359396de565e))
* **deps:** update dependency @types/node to v22.17.2 ([#289](https://github.com/webstreamr/webstreamr/issues/289)) ([8a24dbc](https://github.com/webstreamr/webstreamr/commit/8a24dbcd24b054d498d765c225c556062c054969))
* **extractor:** extract size and title for Fastream URLs ([36f3d70](https://github.com/webstreamr/webstreamr/commit/36f3d70467bca8396d0af847b110ab8b6688772e))


### Bug Fixes

* **extractor:** remove unreliable title height guessing ([35acb49](https://github.com/webstreamr/webstreamr/commit/35acb49545438257615c775161d525989b688c6f))
* **source:** do alternative dash search for HomeCine ([bfdb212](https://github.com/webstreamr/webstreamr/commit/bfdb212770007582c3577f325daef91bbb0a33fe))

## [0.44.0](https://github.com/webstreamr/webstreamr/compare/v0.43.3...v0.44.0) (2025-08-17)


### Miscellaneous Chores

* **source:** bring back Frembed ([f58c302](https://github.com/webstreamr/webstreamr/commit/f58c30299ac5d6a458e96e63b3907f20b35936fb))
* **source:** disable Soaper ([71979d8](https://github.com/webstreamr/webstreamr/commit/71979d82b6843d1b7059d40d29d1aabce40ef8a0))


### Features

* **extractor:** add YouTube extractor ([5e6c71f](https://github.com/webstreamr/webstreamr/commit/5e6c71f4ad81cb3f407d73337f9dd05f93469870))


### Bug Fixes

* **deps:** update dependency undici to v7.14.0 ([#287](https://github.com/webstreamr/webstreamr/issues/287)) ([fe19a91](https://github.com/webstreamr/webstreamr/commit/fe19a91cecc9ed947e7553b9b3bb02b1d0baf0e5))


### Code Refactoring

* fully replace handler with source ([176c4c9](https://github.com/webstreamr/webstreamr/commit/176c4c93e709945eaeda8450a6703b51f4c7a39d))


### Reverts

* "chore(extractor): remove HEAD request to XPrime hosters to determine size" ([73627fb](https://github.com/webstreamr/webstreamr/commit/73627fbf0dc50ba6daf2d7c341c387596ff520cf))

## [0.43.3](https://github.com/webstreamr/webstreamr/compare/v0.43.2...v0.43.3) (2025-08-16)


### Bug Fixes

* **extractor:** use default TTL for XPrime ([63e598a](https://github.com/webstreamr/webstreamr/commit/63e598a725fc6caef0882ce937f5b5137a77493b))

## [0.43.2](https://github.com/webstreamr/webstreamr/compare/v0.43.1...v0.43.2) (2025-08-16)


### Miscellaneous Chores

* double HTTP cache, quadruple extractor cache ([ef613f2](https://github.com/webstreamr/webstreamr/commit/ef613f274247efc382e50475765172c7216a48e5))
* **extractor:** increase XPrime cache to 12 hours ([5316199](https://github.com/webstreamr/webstreamr/commit/5316199b8cf5427699b031bbdfa5eb0b2a77aa32))
* **extractor:** remove HEAD request to XPrime hosters to determine size ([fdf1415](https://github.com/webstreamr/webstreamr/commit/fdf1415f6d6a5ad1d2a45c5e33acbf623cce6bb3))

## [0.43.1](https://github.com/webstreamr/webstreamr/compare/v0.43.0...v0.43.1) (2025-08-15)


### Miscellaneous Chores

* use XPrime in live endpoint ([be33b0b](https://github.com/webstreamr/webstreamr/commit/be33b0b3b99d6e104e201193dc6f3ed00e602240))


### Bug Fixes

* **deps:** update dependency tough-cookie to v6 ([#278](https://github.com/webstreamr/webstreamr/issues/278)) ([7b7b0e1](https://github.com/webstreamr/webstreamr/commit/7b7b0e1e7e515af5b2a649081d502dc710661e8e))
* **extractor:** use title from XPrime API ([a65b8fb](https://github.com/webstreamr/webstreamr/commit/a65b8fb507f1127ec4335b2bb50b4e89283f0cc9))

## [0.43.0](https://github.com/webstreamr/webstreamr/compare/v0.42.1...v0.43.0) (2025-08-15)


### Miscellaneous Chores

* **fetcher:** allow to customize minimum cache ttl ([fe5b3af](https://github.com/webstreamr/webstreamr/commit/fe5b3af88781df8626121f367a5273bcfea629af))


### Features

* **source:** add XPrime ([cfe3887](https://github.com/webstreamr/webstreamr/commit/cfe38878d7bd9a4c09c1295ddfdc4d83842dc689))


### Code Refactoring

* **fetcher:** sort custom request init props ([2a5284d](https://github.com/webstreamr/webstreamr/commit/2a5284d5555f022ced5770127b23c924a8961607))


### Tests

* use proxy in tests ([9854d3b](https://github.com/webstreamr/webstreamr/commit/9854d3b5b6e01a09d6e10e71f3365fabc1d0c4ef))

## [0.42.1](https://github.com/webstreamr/webstreamr/compare/v0.42.0...v0.42.1) (2025-08-14)


### Miscellaneous Chores

* **extractor:** use all VidSrc TLDs to handle rate-limit better ([6492e6b](https://github.com/webstreamr/webstreamr/commit/6492e6be820e0e50b814aa3e661d10517184ac38))
* use mutex per id when resolving streams ([c0797f3](https://github.com/webstreamr/webstreamr/commit/c0797f368733ae3e30bb1fb4cc92949f4a928f47))


### Bug Fixes

* **extractor:** handle SaveFiles locked file ([285996c](https://github.com/webstreamr/webstreamr/commit/285996cbf6f8a8a92fd18cc365006fb980436d75))

## [0.42.0](https://github.com/webstreamr/webstreamr/compare/v0.41.9...v0.42.0) (2025-08-13)


### Miscellaneous Chores

* **fetcher:** retry 5xx errors up to 3 times ([a12ae7a](https://github.com/webstreamr/webstreamr/commit/a12ae7aaa5291835b23ed3da5c84fd5952f08ea0))


### Features

* **extractor:** add SaveFiles support ([c9aaf8b](https://github.com/webstreamr/webstreamr/commit/c9aaf8bb8f23d52dccd58668d089bae428fe8ce5))


### Bug Fixes

* support stream resolving without config ([17da20f](https://github.com/webstreamr/webstreamr/commit/17da20f6d0c18dd7f22fb291b0bfd6256b85a79c))


### Code Refactoring

* **extractor:** clean-up DoodStream sightly ([3e964f2](https://github.com/webstreamr/webstreamr/commit/3e964f28ff3f9a0acbc929e648f7531fbeb40468))

## [0.41.9](https://github.com/webstreamr/webstreamr/compare/v0.41.8...v0.41.9) (2025-08-12)


### Miscellaneous Chores

* clean-up critical error handling ([1a5cad4](https://github.com/webstreamr/webstreamr/commit/1a5cad40a2eedf1eb848157cb1944a8ca556d775))
* **extractor:** add new DoodStream domains ([8a81a5c](https://github.com/webstreamr/webstreamr/commit/8a81a5c14e5f85fb218ae673378ab8c9303506da))


### Bug Fixes

* **source:** keep using jsdom for now because of performance issues ([2d96e1d](https://github.com/webstreamr/webstreamr/commit/2d96e1db8fed5c4ce564cf81cb472d17c08fb44e))


### Reverts

* "fix(fetcher): remove weird proxy headers in request" ([e28de7d](https://github.com/webstreamr/webstreamr/commit/e28de7d4d993c2c70c8eab9a6d4250c1a669c38f))

## [0.41.8](https://github.com/webstreamr/webstreamr/compare/v0.41.7...v0.41.8) (2025-08-12)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.39.1 ([#269](https://github.com/webstreamr/webstreamr/issues/269)) ([ec8c35a](https://github.com/webstreamr/webstreamr/commit/ec8c35af180635db4e045d693f446681cbe48551))


### Bug Fixes

* **source:** bring back PrimeWire 🎉 ([617ae77](https://github.com/webstreamr/webstreamr/commit/617ae77825a02b4d7427ec7644822e7afd1d5e47))

## [0.41.7](https://github.com/webstreamr/webstreamr/compare/v0.41.6...v0.41.7) (2025-08-11)


### Miscellaneous Chores

* **deps:** update actions/checkout action to v5 ([#267](https://github.com/webstreamr/webstreamr/issues/267)) ([ccbebe7](https://github.com/webstreamr/webstreamr/commit/ccbebe751693071d2334eed75b3f50aec93c90b3))


### Bug Fixes

* **fetcher:** simplify header and ttl determination, fix edge case bug ([9a01939](https://github.com/webstreamr/webstreamr/commit/9a019396c847d3867fc0ff24ef7f73bd944cf809))

## [0.41.6](https://github.com/webstreamr/webstreamr/compare/v0.41.5...v0.41.6) (2025-08-11)


### Bug Fixes

* **fetcher:** better detect inline Cloudflare Turnstile ([0efdfa4](https://github.com/webstreamr/webstreamr/commit/0efdfa4a6ff3f1a2b5e0369e3fd974e1a9b93205))
* **fetcher:** remove weird proxy headers in request ([ee09e10](https://github.com/webstreamr/webstreamr/commit/ee09e10e6eefc3fc564115961ef590c842e6c366))

## [0.41.5](https://github.com/webstreamr/webstreamr/compare/v0.41.4...v0.41.5) (2025-08-11)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#265](https://github.com/webstreamr/webstreamr/issues/265)) ([6d44e67](https://github.com/webstreamr/webstreamr/commit/6d44e67a455e0e560e130a411e819056bd17b6b4))
* **deps:** update dependency @stylistic/eslint-plugin to v5.2.3 ([#261](https://github.com/webstreamr/webstreamr/issues/261)) ([e365538](https://github.com/webstreamr/webstreamr/commit/e365538699c3a0b838fa02628a02f8dfe8e1177f))
* **deps:** update dependency @types/node to v22.17.1 ([#264](https://github.com/webstreamr/webstreamr/issues/264)) ([1618fa3](https://github.com/webstreamr/webstreamr/commit/1618fa3c328c222c129f130e91695b42c1a8516b))
* **deps:** update eslint monorepo to v9.33.0 ([#263](https://github.com/webstreamr/webstreamr/issues/263)) ([f7b6ba4](https://github.com/webstreamr/webstreamr/commit/f7b6ba435b6b491f16c4e0b2975ab5a46ab67733))
* disable console methods only on prod ([b7ada8b](https://github.com/webstreamr/webstreamr/commit/b7ada8bbdfdf8c0f11e55045c63e034f77f0a7ad))
* **fetcher:** decrease default timeout back to 10s ([7d70010](https://github.com/webstreamr/webstreamr/commit/7d700103c42f74e215ba5d6f7c0713043a20e3bb))
* **manifest:** add supported languages to description ([3aff950](https://github.com/webstreamr/webstreamr/commit/3aff950598e1a3c09015c1a882467d62a80b680a))
* **manifest:** sort sources for each language in configuration ([491df54](https://github.com/webstreamr/webstreamr/commit/491df542429664a749ecdf8e8f308e13d566d8c0))
* **source:** add English to VixSrc ([6489b10](https://github.com/webstreamr/webstreamr/commit/6489b1052797c7da3a986a1ad62c0c498f4447aa))
* **source:** disable PrimeWire for now ([c3d86fb](https://github.com/webstreamr/webstreamr/commit/c3d86fb47f9b938bd3cdfe5a3ae4ac4d749266b7))

## [0.41.4](https://github.com/webstreamr/webstreamr/compare/v0.41.3...v0.41.4) (2025-08-08)


### Miscellaneous Chores

* add MostraGuarda to live/health check ([8cd5c91](https://github.com/webstreamr/webstreamr/commit/8cd5c91aea797273fbad155403936f13891326f3))
* **fetcher:** block a host temporarily after 30 times timing out instead of 10 ([78ced84](https://github.com/webstreamr/webstreamr/commit/78ced847740e1c6100a924a0d4975e71f6c8fb39))
* remove health endpoint in favor of live ([785091f](https://github.com/webstreamr/webstreamr/commit/785091f340ab08db49785d2b9af9feb59dcba7e2))

## [0.41.3](https://github.com/webstreamr/webstreamr/compare/v0.41.2...v0.41.3) (2025-08-06)


### Miscellaneous Chores

* introduce dedicated startup/ready and live endpoints ([db21d78](https://github.com/webstreamr/webstreamr/commit/db21d78aff3d47d4326a9f6b2346f199a8be207c))

## [0.41.2](https://github.com/webstreamr/webstreamr/compare/v0.41.1...v0.41.2) (2025-08-05)


### Bug Fixes

* do not use special queue config for health check ([dbe27c2](https://github.com/webstreamr/webstreamr/commit/dbe27c29dab5165f86828f0d898c4cc916369aa4))

## [0.41.1](https://github.com/webstreamr/webstreamr/compare/v0.41.0...v0.41.1) (2025-08-05)


### Miscellaneous Chores

* **deps:** update dependency typescript to v5.9.2 ([#255](https://github.com/webstreamr/webstreamr/issues/255)) ([115e227](https://github.com/webstreamr/webstreamr/commit/115e2278d895b6767361731126e7b4d34c1dc8a9))
* **deps:** update dependency typescript-eslint to v8.39.0 ([#254](https://github.com/webstreamr/webstreamr/issues/254)) ([d6fd346](https://github.com/webstreamr/webstreamr/commit/d6fd34668d1771bbfadf0d4dea3dcf09189ec178))
* **deps:** update node.js to v22.18.0 ([#252](https://github.com/webstreamr/webstreamr/issues/252)) ([8ed6321](https://github.com/webstreamr/webstreamr/commit/8ed63213bb2bcbabce02cd733062c34467935434))
* **fetcher:** increase default timeout to 15s ([009bb93](https://github.com/webstreamr/webstreamr/commit/009bb930b5c5a038e2f00bc8429198f58d710c76))
* health check improvements to avoid performance issues ([086c32f](https://github.com/webstreamr/webstreamr/commit/086c32f980f53caec96424234443224a88c817f2))
* use source instances instead of hard-coded URL for health check ([522034b](https://github.com/webstreamr/webstreamr/commit/522034b61cc2f0a3bfb46b7a2690291d4f1883ce))


### Bug Fixes

* **source:** remove useless KinoGer p2pplay.pro URLs ([faa91ce](https://github.com/webstreamr/webstreamr/commit/faa91ce238171fb55efdaf071ca2db53e5a291e4))

## [0.41.0](https://github.com/webstreamr/webstreamr/compare/v0.40.3...v0.41.0) (2025-08-04)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#246](https://github.com/webstreamr/webstreamr/issues/246)) ([f5d3e95](https://github.com/webstreamr/webstreamr/commit/f5d3e95884244b0064aa8d10ca9acc66b6773ab4))
* **deps:** lock file maintenance ([#251](https://github.com/webstreamr/webstreamr/issues/251)) ([9f5652e](https://github.com/webstreamr/webstreamr/commit/9f5652eb150aa69b7f6b865e26e1031cd7e1b8ba))
* **deps:** update dependency @types/node to v22.17.0 ([#250](https://github.com/webstreamr/webstreamr/issues/250)) ([e270737](https://github.com/webstreamr/webstreamr/commit/e270737882e39fdf98e50978af0c13f7127194f0))
* **deps:** update dependency ts-jest to v29.4.1 ([#249](https://github.com/webstreamr/webstreamr/issues/249)) ([9bf5011](https://github.com/webstreamr/webstreamr/commit/9bf5011882c48a032a7d223befc9eea1838d5a75))
* **deps:** update eslint monorepo to v9.32.0 ([#243](https://github.com/webstreamr/webstreamr/issues/243)) ([0dc9d4b](https://github.com/webstreamr/webstreamr/commit/0dc9d4bf35ba9ded57e1124439321a98da305137))
* use source baseUrl for source errors ([c81f17a](https://github.com/webstreamr/webstreamr/commit/c81f17a19ae2f6faf56a794cddf8e45f984737cf))


### Features

* do not show errors by default ([854b211](https://github.com/webstreamr/webstreamr/commit/854b211f2c30abc149a8f2d33fd77f727ce565d1))


### Bug Fixes

* **deps:** update dependency undici to v7.13.0 ([#248](https://github.com/webstreamr/webstreamr/issues/248)) ([43d971a](https://github.com/webstreamr/webstreamr/commit/43d971a1474d65b584df7de9cfcf966e20f2da08))


### Code Refactoring

* **source:** consistently define baseUrl ([b94c539](https://github.com/webstreamr/webstreamr/commit/b94c539269f1e5196d561e2513c759ffa3b94d46))

## [0.40.3](https://github.com/webstreamr/webstreamr/compare/v0.40.2...v0.40.3) (2025-07-24)


### Bug Fixes

* **health check:** better logging, decrease request timeouts ([9a8e6f9](https://github.com/webstreamr/webstreamr/commit/9a8e6f9c690353c4c4a20adbd3f6ec324035a994))


### Code Refactoring

* extract error and logging helper ([cc3dacd](https://github.com/webstreamr/webstreamr/commit/cc3dacdd76cb679c1e9a84b30101a2832b485e72))

## [0.40.2](https://github.com/webstreamr/webstreamr/compare/v0.40.1...v0.40.2) (2025-07-23)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5.2.2 ([#240](https://github.com/webstreamr/webstreamr/issues/240)) ([4ab0c88](https://github.com/webstreamr/webstreamr/commit/4ab0c882625982c1ce53f83d98c875ca0899eeed))


### Bug Fixes

* disable health check failing for blocked issues on non-hayd.uk instances ([ece3b45](https://github.com/webstreamr/webstreamr/commit/ece3b45f59278e209f18dc3cc29a0d2e26f2d4d7))


### Code Refactoring

* extract helpers to figure out which instance we're running on ([be8c664](https://github.com/webstreamr/webstreamr/commit/be8c664b476b834376f75968a31993031ec7b7cd))

## [0.40.1](https://github.com/webstreamr/webstreamr/compare/v0.40.0...v0.40.1) (2025-07-22)


### Miscellaneous Chores

* **deps:** update jest monorepo to v30.0.5 ([#238](https://github.com/webstreamr/webstreamr/issues/238)) ([93194e3](https://github.com/webstreamr/webstreamr/commit/93194e37c947032b9da70ce8e6f9b6beb9a85f45))


### Bug Fixes

* **source:** disable Frembed for now since it keeps timing-out ([5803148](https://github.com/webstreamr/webstreamr/commit/580314883769a08d3fa7f6c8f10da90f8cafce5b))

## [0.40.0](https://github.com/webstreamr/webstreamr/compare/v0.39.2...v0.40.0) (2025-07-21)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#231](https://github.com/webstreamr/webstreamr/issues/231)) ([b0dd5de](https://github.com/webstreamr/webstreamr/commit/b0dd5de51d407888575befd2142712264bf749d8))
* **deps:** update dependency @stylistic/eslint-plugin to v5.2.1 ([#234](https://github.com/webstreamr/webstreamr/issues/234)) ([ff45f43](https://github.com/webstreamr/webstreamr/commit/ff45f431ee80a9dd6c0c48e8e119d398a3b64468))
* **deps:** update dependency @types/node to v22.16.5 ([#230](https://github.com/webstreamr/webstreamr/issues/230)) ([ea7b392](https://github.com/webstreamr/webstreamr/commit/ea7b39200f6aeb3026c8450f1548419ff40ecd94))
* **deps:** update dependency typescript-eslint to v8.38.0 ([#236](https://github.com/webstreamr/webstreamr/issues/236)) ([3c65768](https://github.com/webstreamr/webstreamr/commit/3c657680cb77783d16ccca16c60159dffc1640eb))
* handle cloudflare 451 censor block, show block reasons ([51b9104](https://github.com/webstreamr/webstreamr/commit/51b9104f07f3f1af805e5920c54e6e6bcdb7b187))
* mention languages and MediaFlow Proxy in description ([951d442](https://github.com/webstreamr/webstreamr/commit/951d442a7d1e4ead70e0d4cf89fb9de8596a542d))
* try checking for blocks in health check endpoint ([ef36f48](https://github.com/webstreamr/webstreamr/commit/ef36f48e33ab1416e28ba8c2d555ffe991ebddd5))


### Features

* disable extractors via config ([114d296](https://github.com/webstreamr/webstreamr/commit/114d296fe38839694ed49ef2aa1c197b22c6db3b))


### Bug Fixes

* **deps:** update dependency cheerio to v1.1.1 ([#228](https://github.com/webstreamr/webstreamr/issues/228)) ([3401525](https://github.com/webstreamr/webstreamr/commit/3401525ab63b76e8f17d3b9366b32b5b6ca35bc9))
* **deps:** update dependency cheerio to v1.1.2 ([#235](https://github.com/webstreamr/webstreamr/issues/235)) ([3d76b0a](https://github.com/webstreamr/webstreamr/commit/3d76b0a7b7df5ee9fb93e65c865f117d064d1a37))


### Code Refactoring

* improve manifest type ([6fe09fc](https://github.com/webstreamr/webstreamr/commit/6fe09fc459223a8b2ace1904690978f3af927294))
* introduce createSources() analogue to createExtractors() ([453cc74](https://github.com/webstreamr/webstreamr/commit/453cc747a1008cf8b904549870d6369f7287b774))

## [0.39.2](https://github.com/webstreamr/webstreamr/compare/v0.39.1...v0.39.2) (2025-07-20)


### Bug Fixes

* **fetcher:** support Basic Auth ([674eb7c](https://github.com/webstreamr/webstreamr/commit/674eb7ca6d13c7d5d5083913c6a8e3231da3791d))
* **source:** use latest search params for Eurostreaming ([c62870a](https://github.com/webstreamr/webstreamr/commit/c62870a465f92c0ddf7d1ec39f3574a26ddec9c1))

## [0.39.1](https://github.com/webstreamr/webstreamr/compare/v0.39.0...v0.39.1) (2025-07-20)


### Miscellaneous Chores

* add explicit info that we can't fix 5xx errors ([8ad5a8f](https://github.com/webstreamr/webstreamr/commit/8ad5a8f8e69842d801fde2eaea22e2c77af82804))
* disable all console functions in favor of logger ([d1e410e](https://github.com/webstreamr/webstreamr/commit/d1e410ef33d95b9d24955dbe36224f6646979a12))


### Bug Fixes

* use correct request ID header in context ([1a37662](https://github.com/webstreamr/webstreamr/commit/1a37662502c68effdb153b887ba47f495b17585d))

## [0.39.0](https://github.com/webstreamr/webstreamr/compare/v0.38.1...v0.39.0) (2025-07-18)


### Features

* **extractor:** add Fastream via MediaFlow Proxy ([f3f61c8](https://github.com/webstreamr/webstreamr/commit/f3f61c85cce79f57b15abe74f60075aee413d073))
* **source:** add HomeCine ([5759a31](https://github.com/webstreamr/webstreamr/commit/5759a311aa7c434e721a7cdebaca4752c110522c))


### Bug Fixes

* **deps:** update dependency undici to v7.12.0 ([#223](https://github.com/webstreamr/webstreamr/issues/223)) ([603bcff](https://github.com/webstreamr/webstreamr/commit/603bcff935172db253a6a73008c143c233b15838))
* **extractor:** do not skip external blocked URLs ([533470d](https://github.com/webstreamr/webstreamr/commit/533470d0809768308a7fcde29c85c8403ebe4454))


### Code Refactoring

* make TMDB detail fetching more DRY ([f6dcd74](https://github.com/webstreamr/webstreamr/commit/f6dcd74dfbfd3696c6462b1963c7e2645eb3d99f))

## [0.38.1](https://github.com/webstreamr/webstreamr/compare/v0.38.0...v0.38.1) (2025-07-18)


### Bug Fixes

* do not use cache and proxy headers for health requests ([de8e0bd](https://github.com/webstreamr/webstreamr/commit/de8e0bdd94f6402edbd60c14b6e3bff22643c283))

## [0.38.0](https://github.com/webstreamr/webstreamr/compare/v0.37.2...v0.38.0) (2025-07-18)


### Features

* add health endpoint ([cd19f1c](https://github.com/webstreamr/webstreamr/commit/cd19f1c99965fafc2b7d59712b61a47fcd69c410))


### Code Refactoring

* extract context creation ([5555ba7](https://github.com/webstreamr/webstreamr/commit/5555ba70407b68680fdfe8d1c4a2a41d0e49c00e))

## [0.37.2](https://github.com/webstreamr/webstreamr/compare/v0.37.1...v0.37.2) (2025-07-17)


### Reverts

* "chore: remove Soaper 😭" 🎉 ([1b9ee36](https://github.com/webstreamr/webstreamr/commit/1b9ee36cfdf9583bd59511528361c1339a384ee8))

## [0.37.1](https://github.com/webstreamr/webstreamr/compare/v0.37.0...v0.37.1) (2025-07-16)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5.2.0 ([#219](https://github.com/webstreamr/webstreamr/issues/219)) ([1fda7f6](https://github.com/webstreamr/webstreamr/commit/1fda7f6c50826825f9659fb0694e6c895bb1aa8d))
* **extractor:** normalize Mixdrop non-embed URLs ([7cf313c](https://github.com/webstreamr/webstreamr/commit/7cf313cedbfe7d6fa7e6a43a3e140ecbeb669f5a))

## [0.37.0](https://github.com/webstreamr/webstreamr/compare/v0.36.2...v0.37.0) (2025-07-15)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.37.0 ([#215](https://github.com/webstreamr/webstreamr/issues/215)) ([f701ed3](https://github.com/webstreamr/webstreamr/commit/f701ed39ef1726e3c1187da50d8ae9b4f3b968c5))
* **extractor:** normalize Dropload download URLs ([69afcdc](https://github.com/webstreamr/webstreamr/commit/69afcdcdb253e426585677a6ed357a02ee4691e8))


### Features

* **source:** add PrimeWire ([8f7039b](https://github.com/webstreamr/webstreamr/commit/8f7039bbb36f39a9550f49e5b01408cf742ad88c))


### Bug Fixes

* **fetcher:** import correct Headers ([e03621d](https://github.com/webstreamr/webstreamr/commit/e03621db0bf394eedf01f491f115f348defc171a))

## [0.36.2](https://github.com/webstreamr/webstreamr/compare/v0.36.1...v0.36.2) (2025-07-14)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#212](https://github.com/webstreamr/webstreamr/issues/212)) ([7e2858d](https://github.com/webstreamr/webstreamr/commit/7e2858def30c92f1e3b74754b8c6d333a3935a26))
* **deps:** update dependency @types/node to v22.16.3 ([#211](https://github.com/webstreamr/webstreamr/issues/211)) ([ae9c43e](https://github.com/webstreamr/webstreamr/commit/ae9c43edef6421000ce9c638db433da175fc66db))
* remove Soaper 😭 ([df60013](https://github.com/webstreamr/webstreamr/commit/df60013e1621b82ad0a79d137766e39e572accc5))
* sort errors down ([d6e2918](https://github.com/webstreamr/webstreamr/commit/d6e29185e586e0a233913eed91ee54ba0ce9108d))


### Bug Fixes

* **extractor:** support DoodStream via cloudflarestorage ([25d3211](https://github.com/webstreamr/webstreamr/commit/25d32117eda3857b3a6f4de2b9fe3a4444f6e111))
* **source:** handle non-existent movies gracefully ([a371f86](https://github.com/webstreamr/webstreamr/commit/a371f86933f972357148b3fa11cd9047cc14ddca))

## [0.36.1](https://github.com/webstreamr/webstreamr/compare/v0.36.0...v0.36.1) (2025-07-13)


### Bug Fixes

* **source:** handle non-existent content gracefully via Movix ([599e6ea](https://github.com/webstreamr/webstreamr/commit/599e6eaf7e1286eed967fb213bfeab1476e9f680))

## [0.36.0](https://github.com/webstreamr/webstreamr/compare/v0.35.0...v0.36.0) (2025-07-13)


### Features

* **source:** add Movix ([ca0db32](https://github.com/webstreamr/webstreamr/commit/ca0db32d196170493684fd4eac4f91879f0560e0))

## [0.35.0](https://github.com/webstreamr/webstreamr/compare/v0.34.1...v0.35.0) (2025-07-13)


### Miscellaneous Chores

* **deps:** update eslint monorepo to v9.31.0 ([#206](https://github.com/webstreamr/webstreamr/issues/206)) ([b4d5563](https://github.com/webstreamr/webstreamr/commit/b4d556399afdf7d77ad9b7bf5f7844bb48cd91b3))


### Features

* **source:** fix Frembed domain and enable it for movies ([a4e2472](https://github.com/webstreamr/webstreamr/commit/a4e24722c222ce68fd237587ccb63f334cd0343b))

## [0.34.1](https://github.com/webstreamr/webstreamr/compare/v0.34.0...v0.34.1) (2025-07-11)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#202](https://github.com/webstreamr/webstreamr/issues/202)) ([32d125d](https://github.com/webstreamr/webstreamr/commit/32d125d7a7feed61698905673c7c1f2b030a60f8))
* **deps:** update dependency @types/node to v22.16.0 ([#201](https://github.com/webstreamr/webstreamr/issues/201)) ([3eae8f0](https://github.com/webstreamr/webstreamr/commit/3eae8f0d2a3b6b7241483abe17dcad5cc68fbeb3))
* **deps:** update dependency typescript-eslint to v8.36.0 ([#203](https://github.com/webstreamr/webstreamr/issues/203)) ([7503503](https://github.com/webstreamr/webstreamr/commit/7503503ccf0d9518547362c3bfb9d13d2b060ae2))
* **deps:** update jest monorepo to v30.0.4 ([#198](https://github.com/webstreamr/webstreamr/issues/198)) ([1b40ecd](https://github.com/webstreamr/webstreamr/commit/1b40ecdd07776610ba2dd3427226a691f79074a0))


### Bug Fixes

* **extractor:** ignore processing SuperVideo files ([b11bba7](https://github.com/webstreamr/webstreamr/commit/b11bba761a34274ddd50b7f8c60b8a9563ed3da1))


### Code Refactoring

* **fetcher:** switch to undici fetch ([2c21094](https://github.com/webstreamr/webstreamr/commit/2c210941aae7b039ef85cc968ad5ad805fe05c36))

## [0.34.0](https://github.com/webstreamr/webstreamr/compare/v0.33.0...v0.34.0) (2025-07-02)


### Miscellaneous Chores

* **deps:** update eslint monorepo to v9.30.1 ([#196](https://github.com/webstreamr/webstreamr/issues/196)) ([2515a34](https://github.com/webstreamr/webstreamr/commit/2515a3487478388f8aac46b058c227511bfc90db))
* **source:** improve Soaper matching ([ce4a00c](https://github.com/webstreamr/webstreamr/commit/ce4a00cfddaa5c99ddf88fabe32d001b04077175))


### Features

* **extractor:** add StreamEmbed support ([3d28b22](https://github.com/webstreamr/webstreamr/commit/3d28b226e5e6c33bef638d3c751be01a03aaf4c2))
* **source:** add MegaKino support ([e73dba8](https://github.com/webstreamr/webstreamr/commit/e73dba8445c86ee6b8a0fe7239d73e53af8f39d7))


### Code Refactoring

* **extractor:** move title height guessing into central place ([5da52d6](https://github.com/webstreamr/webstreamr/commit/5da52d648a8fab039ea3b9c691b36ea9e05e9aac))
* **extractor:** sort extractors ([1c986b0](https://github.com/webstreamr/webstreamr/commit/1c986b052186a326f134ca4d76550ac356acbfd9))
* more consistent import style ([5c7b3fb](https://github.com/webstreamr/webstreamr/commit/5c7b3fb7f2f34116263e00fe375a6084e24952e2))

## [0.33.0](https://github.com/webstreamr/webstreamr/compare/v0.32.5...v0.33.0) (2025-07-01)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5.1.0 ([#190](https://github.com/webstreamr/webstreamr/issues/190)) ([4213b15](https://github.com/webstreamr/webstreamr/commit/4213b1571dc653b451510ea19b241474479e66cb))
* **deps:** update dependency @types/jest to v30 ([#193](https://github.com/webstreamr/webstreamr/issues/193)) ([947060b](https://github.com/webstreamr/webstreamr/commit/947060b07e8f2654bc9056a38069d62c30fb4e73))
* **deps:** update dependency @types/node to v22.15.34 ([#192](https://github.com/webstreamr/webstreamr/issues/192)) ([091bb44](https://github.com/webstreamr/webstreamr/commit/091bb44ccd6171371c6c919d0081cbd4d8b829e7))
* **deps:** update dependency typescript-eslint to v8.35.1 ([#194](https://github.com/webstreamr/webstreamr/issues/194)) ([ac78e68](https://github.com/webstreamr/webstreamr/commit/ac78e6831b42308ecac1c9d15b0e90be41544f49))
* **extractor:** add viaMediaFlowProxy flag to extractors ([8c8bfd6](https://github.com/webstreamr/webstreamr/commit/8c8bfd6051b88c036d539713f33f6f1bf4282c2e))
* **extractor:** simplify type and passing of height ([b88eba0](https://github.com/webstreamr/webstreamr/commit/b88eba017d59bc14dc6d3e326d008a23698bbdb2))
* remove warmup ([bf2187b](https://github.com/webstreamr/webstreamr/commit/bf2187bbbdd397a4189427ca9b96b29219339ab3))


### Features

* add Japanese and Korean to languages for VixSrc ([81434ff](https://github.com/webstreamr/webstreamr/commit/81434fff0e19e3df56d6069bfc62608fd8402192))
* **extractor:** implement Streamtape via MediaFlow Proxy ([9d3ce24](https://github.com/webstreamr/webstreamr/commit/9d3ce24b9031256ef0d7c2ee4d7dfb16ab58ba8b))
* make multi sources explicitly configurable ([a0ed13f](https://github.com/webstreamr/webstreamr/commit/a0ed13f18ee2e37ca5a940cbdb2adadfbda0ca3d))


### Bug Fixes

* **source:** update Frembed domain ([0fe5659](https://github.com/webstreamr/webstreamr/commit/0fe5659f08fad23edd1d1aba0722616f5fb8aabd))

## [0.32.5](https://github.com/webstreamr/webstreamr/compare/v0.32.4...v0.32.5) (2025-06-28)


### Miscellaneous Chores

* **deps:** update eslint monorepo to v9.30.0 ([#187](https://github.com/webstreamr/webstreamr/issues/187)) ([de3cc10](https://github.com/webstreamr/webstreamr/commit/de3cc10478629e069414cc42c476d13216c40264))
* **fetcher:** configure max for all TTLCaches ([881fed5](https://github.com/webstreamr/webstreamr/commit/881fed53a4d87e96f4d10dbeb5f83ee0390bf24d))
* **fetcher:** use gzip to compress HTTP cache ([acaa722](https://github.com/webstreamr/webstreamr/commit/acaa7221dd546ea2a1a0cc4845ef8d410bf9d842))
* **fetcher:** use LRUCache for HTTP responses ([f5121bb](https://github.com/webstreamr/webstreamr/commit/f5121bb1fbf5914d1ca9a9e17e3726c69d0d1e2d))


### Bug Fixes

* **deps:** update dependency undici to v7.11.0 ([#184](https://github.com/webstreamr/webstreamr/issues/184)) ([70df4c2](https://github.com/webstreamr/webstreamr/commit/70df4c269778b229544d206cb4a453d3c6cb9ad7))


### Reverts

* Revert "fix(fetcher): remove 200 minimum cache" ([aee0fd8](https://github.com/webstreamr/webstreamr/commit/aee0fd8373ce506713f6e6a14d3dd53e5b08406f))

## [0.32.4](https://github.com/webstreamr/webstreamr/compare/v0.32.3...v0.32.4) (2025-06-26)


### Miscellaneous Chores

* **extractor:** handle Dropload queued files better ([adae573](https://github.com/webstreamr/webstreamr/commit/adae573a0f91cb42ecdd8f5a2c2ac150665f5ce3))
* keep showing VixSrc for Italian to avoid confusions ([d44da65](https://github.com/webstreamr/webstreamr/commit/d44da650bd3d397bfa2bb97b055662bae2c790bf))

## [0.32.3](https://github.com/webstreamr/webstreamr/compare/v0.32.2...v0.32.3) (2025-06-26)


### Bug Fixes

* **extractor:** disable ip/session locked Fsst ([00681e1](https://github.com/webstreamr/webstreamr/commit/00681e1411547aad03c59b98ae9106352ba5b4de))

## [0.32.2](https://github.com/webstreamr/webstreamr/compare/v0.32.1...v0.32.2) (2025-06-25)


### Bug Fixes

* **extractor:** filter by configured languages in VixSrc ([b9d0fb3](https://github.com/webstreamr/webstreamr/commit/b9d0fb361383fcfdb6b3532faa19033451ea94fa))

## [0.32.1](https://github.com/webstreamr/webstreamr/compare/v0.32.0...v0.32.1) (2025-06-25)


### Bug Fixes

* **extractor:** do not cache session-scoped Fsst ([ec037d7](https://github.com/webstreamr/webstreamr/commit/ec037d7c90e9b4a34187515681b7416eef0fa980))
* **fetcher:** remove 200 minimum cache ([80e4f4e](https://github.com/webstreamr/webstreamr/commit/80e4f4edc41351b9c92da4bc22e54a0c000947dd))

## [0.32.0](https://github.com/webstreamr/webstreamr/compare/v0.31.2...v0.32.0) (2025-06-25)


### Miscellaneous Chores

* **deps:** update dependency jest to v30.0.3 ([#174](https://github.com/webstreamr/webstreamr/issues/174)) ([2ed2ea3](https://github.com/webstreamr/webstreamr/commit/2ed2ea372a1602360a4e49a22e79c8795ff853ca))
* **deps:** update node.js to v22.17.0 ([#178](https://github.com/webstreamr/webstreamr/issues/178)) ([28123ca](https://github.com/webstreamr/webstreamr/commit/28123cab00433a0c866118be6b1a34bf6bca4ebb))
* handle invalid MediaFlow Proxy password better ([e895077](https://github.com/webstreamr/webstreamr/commit/e895077a7bf8d7c4a3f4417c0bae95428461ad07))


### Features

* **extractor:** support multi-language in VixSrc ([c0fc6ff](https://github.com/webstreamr/webstreamr/commit/c0fc6ff7ea9d1885a36b572cd4811c7e259fc4dd))
* make VixSrc a default multi-language source ([35e049f](https://github.com/webstreamr/webstreamr/commit/35e049f577e05ae58846b63228159212adb5734e))


### Bug Fixes

* build MediaFlow Proxy URL without concatenation ([3ac1063](https://github.com/webstreamr/webstreamr/commit/3ac1063c9bd78a0c877f776063ba525377a99de7))


### Code Refactoring

* add support for multi-language extractor results ([91d5e9d](https://github.com/webstreamr/webstreamr/commit/91d5e9dd366af6aa693109ff2e0009d7d903cab1))

## [0.31.2](https://github.com/webstreamr/webstreamr/compare/v0.31.1...v0.31.2) (2025-06-24)


### Miscellaneous Chores

* empty commit to trigger release ([5fffd0a](https://github.com/webstreamr/webstreamr/commit/5fffd0a2d3479e9ed0fdfe605a8577847b99bc69))

## [0.31.1](https://github.com/webstreamr/webstreamr/compare/v0.31.0...v0.31.1) (2025-06-24)


### Bug Fixes

* **extractor:** avoid cache clash between context dependent extractors ([287b031](https://github.com/webstreamr/webstreamr/commit/287b031a129e6ba6b4ba6fd1352440694a04eee0))

## [0.31.0](https://github.com/webstreamr/webstreamr/compare/v0.30.2...v0.31.0) (2025-06-24)


### Features

* **extractor:** implement VixSrc via MediaFlow Proxy ([f12e3c5](https://github.com/webstreamr/webstreamr/commit/f12e3c5bd823432faa500a76cb6c2c4431bd6f7f))
* pre-load ElfHosted MediaFlow Proxy config URL ([9e22420](https://github.com/webstreamr/webstreamr/commit/9e2242093c32c6e6537e32e52fae7f7f97996f17))


### Bug Fixes

* support password-less MediaFlow Proxy ([39dec26](https://github.com/webstreamr/webstreamr/commit/39dec2645007be92e99872c3efe60573b22908aa))
* typo/grammar mistake in includeExternalUrls config option ([412e89b](https://github.com/webstreamr/webstreamr/commit/412e89b69048e80e7eefacfc8265a626417e576b))


### Code Refactoring

* pass Context instead of Config to MFP helper ([7ea5722](https://github.com/webstreamr/webstreamr/commit/7ea57222d95915478cd1c2713c3f9ef27ea24a0f))

## [0.30.2](https://github.com/webstreamr/webstreamr/compare/v0.30.1...v0.30.2) (2025-06-24)


### Bug Fixes

* **source:** update Frembed domain ([24601fe](https://github.com/webstreamr/webstreamr/commit/24601fee3e476e10e858ea20c2681801459d0155))


### Code Refactoring

* extract Media Flow Proxy functions ([b2eb16f](https://github.com/webstreamr/webstreamr/commit/b2eb16fc820840b57c2026c7ec3e54f429e860dd))

## [0.30.1](https://github.com/webstreamr/webstreamr/compare/v0.30.0...v0.30.1) (2025-06-23)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.35.0 ([#164](https://github.com/webstreamr/webstreamr/issues/164)) ([5656abb](https://github.com/webstreamr/webstreamr/commit/5656abb26c65e709690f8f7f6431c107f567bbd6))


### Bug Fixes

* **source:** do not mix es/mx in Cuevana ([bd67664](https://github.com/webstreamr/webstreamr/commit/bd676648276b44acf109e2a57660f67ba7f94cf1))

## [0.30.0](https://github.com/webstreamr/webstreamr/compare/v0.29.3...v0.30.0) (2025-06-23)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v5 ([#160](https://github.com/webstreamr/webstreamr/issues/160)) ([74e9653](https://github.com/webstreamr/webstreamr/commit/74e965399ab0da69bce91d72cf456675f54d1e9c))
* **deps:** update dependency @types/node to v22.15.32 ([#159](https://github.com/webstreamr/webstreamr/issues/159)) ([fca2841](https://github.com/webstreamr/webstreamr/commit/fca2841ce01b3e5b34adaf2ccf4c82137ec777cd))
* **extractor:** add MediaFlow Proxy info to Mixdrop label ([d641fa1](https://github.com/webstreamr/webstreamr/commit/d641fa1c2d19c444d21bbd17162c632daef2026e))


### Features

* **extractor:** implement Mixdrop via MediaFlow Proxy ([7c60042](https://github.com/webstreamr/webstreamr/commit/7c600427e6161253bbb3d3d144bd8fca23b6cd1d))
* **extractor:** implement Uqload via MediaFlow Proxy ([ab588a1](https://github.com/webstreamr/webstreamr/commit/ab588a1501658f2c3f93fc93aaa358bc2644ba01))
* **fetcher:** add proxy support ([f90a53d](https://github.com/webstreamr/webstreamr/commit/f90a53da680f73c08216ebbe01cc5c2aa635d17f))


### Bug Fixes

* **extractor:** introduce format and set notWebReady accordingly ([fd1145c](https://github.com/webstreamr/webstreamr/commit/fd1145c16223883fb23c9172b7ae3404552e4d33))

## [0.29.3](https://github.com/webstreamr/webstreamr/compare/v0.29.2...v0.29.3) (2025-06-19)


### Miscellaneous Chores

* **deps:** update jest monorepo to v30.0.1 ([#152](https://github.com/webstreamr/webstreamr/issues/152)) ([ac73597](https://github.com/webstreamr/webstreamr/commit/ac735976d1d878d4f1d7e8045256c3d8f9af92ab))
* **deps:** update jest monorepo to v30.0.2 ([#154](https://github.com/webstreamr/webstreamr/issues/154)) ([6f1f046](https://github.com/webstreamr/webstreamr/commit/6f1f04681fbcdd70263be8060e3cc57fed678e2c))
* **extractor:** show label instead of host for errors ([1d263b5](https://github.com/webstreamr/webstreamr/commit/1d263b5540aa80f10cca460b2407cf6a75f073fa))
* **fetcher:** remove unneeded istanbul ([d88cfd4](https://github.com/webstreamr/webstreamr/commit/d88cfd404c672ae74f7866b99705d45e7e194d39))
* make ip in Context optional ([138e92a](https://github.com/webstreamr/webstreamr/commit/138e92afc5c94b9ed60bbd0fc61d5d86d84b068c))
* use add-on URL as default externalUrl ([552620a](https://github.com/webstreamr/webstreamr/commit/552620a7eb577a8f40d3c74aab2014cfe43f693d))


### Bug Fixes

* config checkbox handling of includeExternalUrls ([b5855aa](https://github.com/webstreamr/webstreamr/commit/b5855aaab493deedd497458ce7ea5be42dd2bcf7))


### Tests

* introduce helper function createTestContext ([2d4c5a8](https://github.com/webstreamr/webstreamr/commit/2d4c5a82213c111f2138e5e1b330eaf676876316))

## [0.29.2](https://github.com/webstreamr/webstreamr/compare/v0.29.1...v0.29.2) (2025-06-18)


### Miscellaneous Chores

* **deps:** update dependency fetch-mock to v12.5.3 ([#148](https://github.com/webstreamr/webstreamr/issues/148)) ([9fcc1c6](https://github.com/webstreamr/webstreamr/commit/9fcc1c60d475f3051fa059b52f9799575937fc77))
* do not show external URLs by default ([c1f9de5](https://github.com/webstreamr/webstreamr/commit/c1f9de58b0a08f240dbf92dfc1e0fe4905bfb84f))
* more minimal result format with less bloat and icons ([deef8ab](https://github.com/webstreamr/webstreamr/commit/deef8ab58b7a9740ca07cdec3282891ae1d06108))


### Bug Fixes

* **extractor:** handle Fsst with single file result ([6c7993c](https://github.com/webstreamr/webstreamr/commit/6c7993cdba324160b47a3734b9c9fd6e693f8284))

## [0.29.1](https://github.com/webstreamr/webstreamr/compare/v0.29.0...v0.29.1) (2025-06-17)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.34.1 ([#145](https://github.com/webstreamr/webstreamr/issues/145)) ([aa9085c](https://github.com/webstreamr/webstreamr/commit/aa9085c2631bc37cd31e28ae3cb44c800f140181))
* **fetcher:** remember recent timeouts and throw if count is too high ([f7042b9](https://github.com/webstreamr/webstreamr/commit/f7042b94ef7da5de1c5d581ee5236df910508317))


### Code Refactoring

* avoid leaking fetch internals by introducing TimeoutError ([e1f5192](https://github.com/webstreamr/webstreamr/commit/e1f5192f4bfc210cd1d944869b06ca1046d6786f))

## [0.29.0](https://github.com/webstreamr/webstreamr/compare/v0.28.4...v0.29.0) (2025-06-16)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#144](https://github.com/webstreamr/webstreamr/issues/144)) ([b00ec55](https://github.com/webstreamr/webstreamr/commit/b00ec559e049b06b3246816f91c425bc3651a258))
* **deps:** update dependency @types/node to v22.15.31 ([#143](https://github.com/webstreamr/webstreamr/issues/143)) ([a5daea4](https://github.com/webstreamr/webstreamr/commit/a5daea497d7f2c607827e9eb4580dc85caf9ed33))
* **extractor:** set Referer to URL origin for external URLs ([952993a](https://github.com/webstreamr/webstreamr/commit/952993a537bc0fd59229fc8b0091a5e7a6a0ed09))
* **source:** improve Eurostreaming (IT) search with multi-word keyword ([a4ceca5](https://github.com/webstreamr/webstreamr/commit/a4ceca57ae49fe950fafa6a57204b1d6803d5edf))


### Features

* **source:** add basic Cuevana support ([f192051](https://github.com/webstreamr/webstreamr/commit/f192051328bf213521ff54e39549bdf8761310f5))


### Code Refactoring

* **fetcher:** introduce constants for defaults ([2a8e67c](https://github.com/webstreamr/webstreamr/commit/2a8e67ca5957a39bbaa839dc3a8070d2169dc4fc))
* **fetcher:** use Semaphore with timeout for queuing ([d5ee89d](https://github.com/webstreamr/webstreamr/commit/d5ee89db9bb9152bdeff57a3658f2b1a1c97ad8f))

## [0.28.4](https://github.com/webstreamr/webstreamr/compare/v0.28.3...v0.28.4) (2025-06-15)


### Miscellaneous Chores

* **fetcher:** increase general timeouts ([6cf31f6](https://github.com/webstreamr/webstreamr/commit/6cf31f60de8e5f6bcff4d2b6254f5fc160f05ef6))
* increase tmdb queuing limits ([e9ccee5](https://github.com/webstreamr/webstreamr/commit/e9ccee56211ad9dd854482cc4c2fba0bc5901996))


### Bug Fixes

* **extractor:** handle missing height infos in playlist properly ([3a28de4](https://github.com/webstreamr/webstreamr/commit/3a28de46bd8abb97023e9307b4e36e33738b4c8c))
* **extractor:** only cache URL results if there was no error ([dd121a0](https://github.com/webstreamr/webstreamr/commit/dd121a068a97b940945c976b855b3f1dd76a369d))

## [0.28.3](https://github.com/webstreamr/webstreamr/compare/v0.28.2...v0.28.3) (2025-06-14)


### Bug Fixes

* **fetcher:** consider request body for cache key ([6541782](https://github.com/webstreamr/webstreamr/commit/6541782541f5cf5ed13effff3a7366e4e36c9db9))

## [0.28.2](https://github.com/webstreamr/webstreamr/compare/v0.28.1...v0.28.2) (2025-06-14)


### Miscellaneous Chores

* **deps:** update eslint monorepo to v9.29.0 ([#138](https://github.com/webstreamr/webstreamr/issues/138)) ([0e6558e](https://github.com/webstreamr/webstreamr/commit/0e6558e0b11919720b5dc9fcfa7bc1c73d50c37d))
* do not pass referer through context ([f11c591](https://github.com/webstreamr/webstreamr/commit/f11c591dc544f41720d5c9002bd5216449c60e3b))
* **extractor:** add various exotic DoodStream domains ([81d788e](https://github.com/webstreamr/webstreamr/commit/81d788ef843614e95b764c2ac6a3eb758294e792))
* handle not found TMDB IDs better ([5f34be1](https://github.com/webstreamr/webstreamr/commit/5f34be12a9d08eb1096a0a1fbe63f3c1494fc589))
* implement rate-limit detection ([605e88f](https://github.com/webstreamr/webstreamr/commit/605e88fef4821d65d61e888e9432d290ffa89174))


### Bug Fixes

* **source:** adapt and enable Eurostreaming (IT) again ([6a773f7](https://github.com/webstreamr/webstreamr/commit/6a773f77400ec712527549cf5a7a3f656a2f288c))


### Code Refactoring

* use context scoped fixtures ([2853bff](https://github.com/webstreamr/webstreamr/commit/2853bff284224bf7b1a1d79fb6454db712dcd4fb))
* use proper prototype class methods ([4bc2569](https://github.com/webstreamr/webstreamr/commit/4bc25692a890d89507e7b608ace51ff44783696b))


### Tests

* hand-rolled, explicit Fetcher mock ([3a4ff73](https://github.com/webstreamr/webstreamr/commit/3a4ff739538a4748a892f1bb28020744fce90dfe))
* instantiate mocked Fetcher with logger consistently ([4caf62a](https://github.com/webstreamr/webstreamr/commit/4caf62a367184216c4b0a33cc0c6fd542362a30f))

## [0.28.1](https://github.com/webstreamr/webstreamr/compare/v0.28.0...v0.28.1) (2025-06-13)


### Miscellaneous Chores

* **deps:** update dependency ts-jest to v29.4.0 ([#135](https://github.com/webstreamr/webstreamr/issues/135)) ([af8cadc](https://github.com/webstreamr/webstreamr/commit/af8cadc1433687fe16149233fd817f0773bffcfe))
* **deps:** update jest monorepo to v30 ([c9d8a03](https://github.com/webstreamr/webstreamr/commit/c9d8a031563f529c8cd9e7651f7120bd2152dcb2))
* **fetcher:** decrease regular request timeout to 5s ([5aeab3f](https://github.com/webstreamr/webstreamr/commit/5aeab3fe23f86fcd654762d318e0d3ce3a71dbab))
* rename handler to source ([b4b8581](https://github.com/webstreamr/webstreamr/commit/b4b85813839cacf4feca0396225db16344851a7c))


### Bug Fixes

* **extractor:** detect SuperVideo video deletion/expiration ([d1da91e](https://github.com/webstreamr/webstreamr/commit/d1da91e03036e06581e258a0366e7f9a15803bb8))
* **extractor:** handle missing VidSrc files ([013fb40](https://github.com/webstreamr/webstreamr/commit/013fb4084fe5d48d2b76b9a3bcebd57cefd39dee))


### Code Refactoring

* clean up handler import ([9432ba5](https://github.com/webstreamr/webstreamr/commit/9432ba59446347bf82876dd2b73c07c008c6520e))
* define member accessiblity explicitly ([bdae1ff](https://github.com/webstreamr/webstreamr/commit/bdae1ff34612fee072759b5dd4034a4b28f00ffe))
* **extractor:** introduce parent class for simplifications ([9b59432](https://github.com/webstreamr/webstreamr/commit/9b5943208e726a15b9467772a4c71be5b2c14957))
* introduce helper `showExternalUrls()` ([15099de](https://github.com/webstreamr/webstreamr/commit/15099de798c4b4b85a76a51661742d56fd2bfd18))
* make BlockedReason an enum ([b5067aa](https://github.com/webstreamr/webstreamr/commit/b5067aa0a910393e6aa50b1f4e4514c09a986ba7))
* make CountryCode an enum ([250d6a1](https://github.com/webstreamr/webstreamr/commit/250d6a13233867041e2ab67d9aa6d983bde52589))
* separate handlers and extractors ([d2d7e84](https://github.com/webstreamr/webstreamr/commit/d2d7e84d9b14b5c0d9807851ac961b3b62099a8b))


### Tests

* enable new globalsCleanup ([2447780](https://github.com/webstreamr/webstreamr/commit/244778058c8bae17cac6a5ed88bfc31f6b90e2ae))

## [0.28.0](https://github.com/webstreamr/webstreamr/compare/v0.27.2...v0.28.0) (2025-06-11)


### Miscellaneous Chores

* **extractor:** improve SuperVideo title ([2ea8c16](https://github.com/webstreamr/webstreamr/commit/2ea8c16d9e2b01ed8eb1b1d2ef7036daff47aae6))


### Features

* **handler:** add VidSrc with CloudStream Pro support ([dd6d485](https://github.com/webstreamr/webstreamr/commit/dd6d4853400fe75a81e9118e0306449ad0477654))


### Bug Fixes

* **fetcher:** correct noFlareSolverr logic ([d0efc07](https://github.com/webstreamr/webstreamr/commit/d0efc0783f433dc50d56aea102a9bb9bc77c6128))


### Code Refactoring

* extract playlist height guessing ([4dc3c63](https://github.com/webstreamr/webstreamr/commit/4dc3c636a6397229a500e8370f74f5c2b19a1a3e))

## [0.27.2](https://github.com/webstreamr/webstreamr/compare/v0.27.1...v0.27.2) (2025-06-11)


### Miscellaneous Chores

* **extractor:** decrease timeout and ignore errors for external URLs ([19395f1](https://github.com/webstreamr/webstreamr/commit/19395f1921c8b1cfa1612d06722b3cd1d2bef3bc))
* **extractor:** support dooood URLs ([63079bf](https://github.com/webstreamr/webstreamr/commit/63079bf80a698597a8c808d705ea02407780ae3d))


### Bug Fixes

* **handler:** avoid creating invalid URLs in KinoGer ([9797957](https://github.com/webstreamr/webstreamr/commit/9797957778c4ce262d157ba2f3e62bb41d57148a))

## [0.27.1](https://github.com/webstreamr/webstreamr/compare/v0.27.0...v0.27.1) (2025-06-10)


### Miscellaneous Chores

* log error stack ([695bf53](https://github.com/webstreamr/webstreamr/commit/695bf53262e3033d1e24554036e5e108f37b2da2))


### Bug Fixes

* **handler:** do not share decipher instance in KinoGer ([fcec03a](https://github.com/webstreamr/webstreamr/commit/fcec03a6a459f2ea5f077968ce9b81885193785b))

## [0.27.0](https://github.com/webstreamr/webstreamr/compare/v0.26.1...v0.27.0) (2025-06-10)


### Miscellaneous Chores

* **extractor:** add DoodStream height guessing based on title ([b940df5](https://github.com/webstreamr/webstreamr/commit/b940df5bc095ed9c5537271321abfcd360909531))


### Features

* **extractor:** implement KinoGer extractor ([262abde](https://github.com/webstreamr/webstreamr/commit/262abde2fcb5a13734d6338be70a9bbf9e988c92))


### Bug Fixes

* **extractor:** prefer using extractor title ([041c04e](https://github.com/webstreamr/webstreamr/commit/041c04e327baca327a1de84ecfc38e2f602e8c07))

## [0.26.1](https://github.com/webstreamr/webstreamr/compare/v0.26.0...v0.26.1) (2025-06-10)


### Miscellaneous Chores

* **extractor:** support dooodster links via DoodStream ([141c737](https://github.com/webstreamr/webstreamr/commit/141c737cf3ae1b4dfafbd4621570d5369df5816d))
* **extractor:** support embed-only SuperVideo URLs ([dd1b3a1](https://github.com/webstreamr/webstreamr/commit/dd1b3a1f1d7d6573ec3423fcea71732f637ca46f))
* **handler:** generalize KinoGer to support more (external) URLs ([42950bc](https://github.com/webstreamr/webstreamr/commit/42950bc2a38bb880a4c272ba87deb2c68655450a))


### Code Refactoring

* **extractor:** add return type to all extract methods ([4da121d](https://github.com/webstreamr/webstreamr/commit/4da121d094343c499982877b1544445ac2e15be6))
* **extractor:** introduce URL normalization ([2d615ce](https://github.com/webstreamr/webstreamr/commit/2d615ce5821985d98ba4e2ec04c5664b3f8ce7c3))
* **handler:** improve KinoGer readability ([73ea091](https://github.com/webstreamr/webstreamr/commit/73ea091b83d65790b736b2c40a4fa5813f20ea11))
* remove always true conditional ([7b933bf](https://github.com/webstreamr/webstreamr/commit/7b933bfbac3862f5a4b0152587bf421a2623ed92))

## [0.26.0](https://github.com/webstreamr/webstreamr/compare/v0.25.3...v0.26.0) (2025-06-09)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.34.0 ([#127](https://github.com/webstreamr/webstreamr/issues/127)) ([b5a4de9](https://github.com/webstreamr/webstreamr/commit/b5a4de9c9e0ffee39ef5d99c07449c160f77bd82))


### Features

* **handler:** add support for KinoGer Fsst ([8382c00](https://github.com/webstreamr/webstreamr/commit/8382c009f4113d67a0192cdd7d43284a7266e0fd))


### Bug Fixes

* avoid potential queuing dead lock ([16e1aab](https://github.com/webstreamr/webstreamr/commit/16e1aab1c2ec896593b19364e7a611c6376f9c5e))


### Code Refactoring

* season instead of series ;) ([7ad61df](https://github.com/webstreamr/webstreamr/commit/7ad61df839091b9520bffdb4abff18b95e0715af))


### Tests

* remove usesless filter calls ([bc9c41f](https://github.com/webstreamr/webstreamr/commit/bc9c41f0054d04dbfd04af35116adc141bb8595e))

## [0.25.3](https://github.com/webstreamr/webstreamr/compare/v0.25.2...v0.25.3) (2025-06-09)


### Miscellaneous Chores

* **deps:** update dependency @types/express to v5.0.3 ([#124](https://github.com/webstreamr/webstreamr/issues/124)) ([ffeb135](https://github.com/webstreamr/webstreamr/commit/ffeb135bcc077b1e3f752a5f70711a6a35ead624))
* **deps:** update dependency @types/node to v22.15.30 ([#125](https://github.com/webstreamr/webstreamr/issues/125)) ([315588b](https://github.com/webstreamr/webstreamr/commit/315588bc78df0186c7701d20e31f04e1a2f13743))
* **extractor:** don't use FlareSolverr for external URLs ([1ca4ea4](https://github.com/webstreamr/webstreamr/commit/1ca4ea4abe03065dcd93382533d9cf5cb13dacdf))
* **fetcher:** only call FlareSolverr for known challenge blocks ([114c383](https://github.com/webstreamr/webstreamr/commit/114c383c54d374fd62232c3f851a7f2dfa9f21b6))


### Bug Fixes

* **deps:** update dependency cheerio to v1.1.0 ([#122](https://github.com/webstreamr/webstreamr/issues/122)) ([6c5dcec](https://github.com/webstreamr/webstreamr/commit/6c5dcec71eb4560dcca7ebbc7119be5b173d0e13))
* **handler:** fix KinoKiste which is now StreamKiste ([cbec7c1](https://github.com/webstreamr/webstreamr/commit/cbec7c1a015625a5bb7af92484484b68a572ddbf))


### Tests

* use snapshots for manifest config tests ([6dff634](https://github.com/webstreamr/webstreamr/commit/6dff63429948b596a9a5bafd0c50861bc8bd4930))

## [0.25.2](https://github.com/webstreamr/webstreamr/compare/v0.25.1...v0.25.2) (2025-06-08)


### Miscellaneous Chores

* **extractor:** add  bytes detection to DoodStream ([d1ff7cd](https://github.com/webstreamr/webstreamr/commit/d1ff7cd732892f023107f7e703c1503021280152))
* **handler:** add height detection to Soaper ([7d0544a](https://github.com/webstreamr/webstreamr/commit/7d0544a5906e84fea3bb333875eb67df799fba74))


### Code Refactoring

* `UrlResult[]` instead of `UrlResult | undefined` ([0446d52](https://github.com/webstreamr/webstreamr/commit/0446d52e7879b8c2e35954f1179447097021a291))


### Tests

* **handler:** avoid side-effects by using a fresh handler for each test ([364bf16](https://github.com/webstreamr/webstreamr/commit/364bf166ae22a2666f5cb4331b4f6f8725bf9563))

## [0.25.1](https://github.com/webstreamr/webstreamr/compare/v0.25.0...v0.25.1) (2025-06-08)


### Miscellaneous Chores

* **handler:** add year to soaper result movie title ([968b7d4](https://github.com/webstreamr/webstreamr/commit/968b7d4bc0a4359e0f81513abc6f7a67a91df571))
* introduce config helper, enable English by default ([48209ac](https://github.com/webstreamr/webstreamr/commit/48209ac87640d09ef86ffe78e44492ae78014a65))


### Code Refactoring

* introduce ImdbId and TmdbId ([374896c](https://github.com/webstreamr/webstreamr/commit/374896caca7b9e42e72be97cd6435953100a80b4))
* move ids into dedicated folder ([8724e04](https://github.com/webstreamr/webstreamr/commit/8724e0486056ba091996819135e952a87874e7ce))
* simplify id usage and imdb &lt;-&gt; tmdb transformations ([fbae392](https://github.com/webstreamr/webstreamr/commit/fbae3924e591aa4550b5d3f88583818219b55d5f))
* strictly type `ContentType` ([62f18ec](https://github.com/webstreamr/webstreamr/commit/62f18ece85eaa3c8721e27500674e1f028e6a69d))

## [0.25.0](https://github.com/webstreamr/webstreamr/compare/v0.24.1...v0.25.0) (2025-06-07)


### Features

* **handler:** implement EN Soaper source ([717c2af](https://github.com/webstreamr/webstreamr/commit/717c2afdc4b6802d45ab149cb03a2415d9258e5d))


### Code Refactoring

* add custom helper for flags instead of package ([a56aea5](https://github.com/webstreamr/webstreamr/commit/a56aea56a8e80a7924ce2de9503d73dd695029be))


### Tests

* rename confusing tests ([5bda4c8](https://github.com/webstreamr/webstreamr/commit/5bda4c88f04d7d8bef70c44697971bf7511737fa))

## [0.24.1](https://github.com/webstreamr/webstreamr/compare/v0.24.0...v0.24.1) (2025-06-06)


### Miscellaneous Chores

* only warm up cache in prod ([99434aa](https://github.com/webstreamr/webstreamr/commit/99434aa49a5dd4eb39c15529dc0fe118f20f3399))
* warm up cache only with trending movies and tv shows ([ab39636](https://github.com/webstreamr/webstreamr/commit/ab396361968c5f58564160d34b36f0bf1671417e))

## [0.24.0](https://github.com/webstreamr/webstreamr/compare/v0.23.5...v0.24.0) (2025-06-06)


### Miscellaneous Chores

* add statusText to HttpError and show in result as well ([8766988](https://github.com/webstreamr/webstreamr/commit/876698825f7230b22096a51565ec051c43337b86))
* **handler:** support TMDB ID in Frembed ([01218c7](https://github.com/webstreamr/webstreamr/commit/01218c77a6f4319a6b231a865f307e99c34fde1e))
* **imdb:** stricter parsing checks ([860a6ae](https://github.com/webstreamr/webstreamr/commit/860a6ae18c536075accf1ce8604cf94494b1a5c7))
* **tmdb:** add getImdbIdFromTmdbId and cache both ID transformations ([a0e83f2](https://github.com/webstreamr/webstreamr/commit/a0e83f287d42c0637b730387743bc46ac05904b2))
* **tmdb:** add parseTmdbId ([355663f](https://github.com/webstreamr/webstreamr/commit/355663f03609e8fedd857ab3dad975d16d01b0f7))


### Features

* implement hourly movie cache warmup ([9ba4e73](https://github.com/webstreamr/webstreamr/commit/9ba4e7374c6f161bafb7387ce39d3ec5a1115667))

## [0.23.5](https://github.com/webstreamr/webstreamr/compare/v0.23.4...v0.23.5) (2025-06-05)


### Miscellaneous Chores

* introduce HttpError and show status in result ([d8f0c46](https://github.com/webstreamr/webstreamr/commit/d8f0c4602c14dc719b2e67efcf7011b11bb34957))


### Bug Fixes

* always sort external URLs down ([8e57400](https://github.com/webstreamr/webstreamr/commit/8e57400c588e784008280178f815b89f67b5aa09))
* **handler:** skip invalid CSV URLs ([04ee59e](https://github.com/webstreamr/webstreamr/commit/04ee59e9d3c3cdd3f84d2d05f517e5fbfea8f463))

## [0.23.4](https://github.com/webstreamr/webstreamr/compare/v0.23.3...v0.23.4) (2025-06-05)


### Miscellaneous Chores

* **fetcher:** simplify queuing and allow parallel requests ([be34643](https://github.com/webstreamr/webstreamr/commit/be3464369b330819e0953fe4fe85fbf13b82f6f2))

## [0.23.3](https://github.com/webstreamr/webstreamr/compare/v0.23.2...v0.23.3) (2025-06-05)


### Miscellaneous Chores

* **fetcher:** enable keepalive ([65d2d0a](https://github.com/webstreamr/webstreamr/commit/65d2d0ac83ccc534a57ded839ccd33de76b484d3))


### Bug Fixes

* **fetcher:** use expires FlareSolverr cookie prop ([#111](https://github.com/webstreamr/webstreamr/issues/111)) ([523bbc0](https://github.com/webstreamr/webstreamr/commit/523bbc0f41c05fc681ac6a952ba39df448746d4e))


### Code Refactoring

* **fetcher:** add full FlareSolverrResult type ([092ee4b](https://github.com/webstreamr/webstreamr/commit/092ee4bfc2b7ee92c3adeefcacb99c3b2fdfc9ee))
* **fetcher:** introduce CustomRequestInit ([63a53a1](https://github.com/webstreamr/webstreamr/commit/63a53a18cccb4ae149eae2db94f1ad2ca2a5933d))

## [0.23.2](https://github.com/webstreamr/webstreamr/compare/v0.23.1...v0.23.2) (2025-06-04)


### Miscellaneous Chores

* **fetcher:** persist and use FlareSolverr cookie and user agent ([aa4c672](https://github.com/webstreamr/webstreamr/commit/aa4c6725944d7fffc071acfcb27d57f1141e869c))
* **fetcher:** use queue limit of 10 again :) ([0d3a5b8](https://github.com/webstreamr/webstreamr/commit/0d3a5b89195d95ba5abaccf970daede17457e74e))
* **fetcher:** use well-working node user agent by default again ([efb0f96](https://github.com/webstreamr/webstreamr/commit/efb0f96be2da675ff60c944bdcdfd351cdd81631))

## [0.23.1](https://github.com/webstreamr/webstreamr/compare/v0.23.0...v0.23.1) (2025-06-04)


### Miscellaneous Chores

* **fetcher:** increase queue limit to 30 ([e6aa95f](https://github.com/webstreamr/webstreamr/commit/e6aa95f8755757abcd4c6a5170ac113437d981d1))
* **fetcher:** use FlareSolverr also for other 403 Cloudflare responses ([7387aef](https://github.com/webstreamr/webstreamr/commit/7387aef7640578ee7bd94fe8a48f5e1ad0a6742a))


### Bug Fixes

* **fetcher:** improve Flaresolverr fetching ([2c9faeb](https://github.com/webstreamr/webstreamr/commit/2c9faebcdce43b49ba63f1d0f47c9da256da0ed9))

## [0.23.0](https://github.com/webstreamr/webstreamr/compare/v0.22.10...v0.23.0) (2025-06-04)


### Miscellaneous Chores

* do not log headers for known blocking reasons ([7ec7219](https://github.com/webstreamr/webstreamr/commit/7ec7219ed40cf6a338611b688ca5500674511e8d))


### Features

* **fetcher:** add FlareSolverr support ([af65ed0](https://github.com/webstreamr/webstreamr/commit/af65ed0094a876565bde4ae3952af0e7ca3d29f1))


### Bug Fixes

* **extractor:** do not mutate URLs to avoid cache misses ([1b8f75f](https://github.com/webstreamr/webstreamr/commit/1b8f75f00ef195649fa9ffa360b42bb1794f03c8))
* never cache result errors ([fef59dd](https://github.com/webstreamr/webstreamr/commit/fef59dd03b7b0474418b71f42c96382bda9f277c))

## [0.22.10](https://github.com/webstreamr/webstreamr/compare/v0.22.9...v0.22.10) (2025-06-04)


### Miscellaneous Chores

* **fetcher:** hard-code user-agent again for debugging purposes ([422f7d0](https://github.com/webstreamr/webstreamr/commit/422f7d014cd2c38f61ea61f1069338a0b1320e38))


### Code Refactoring

* extract env access into helpers ([77fc20c](https://github.com/webstreamr/webstreamr/commit/77fc20cfff2a8d6995cb4a836dde281ec960bb77))

## [0.22.9](https://github.com/webstreamr/webstreamr/compare/v0.22.8...v0.22.9) (2025-06-04)


### Miscellaneous Chores

* cache successful results as long as we safely can ([b69c9cd](https://github.com/webstreamr/webstreamr/commit/b69c9cde03a4c46dfb2e8f18ba88ffe0508c13d4))
* **deps:** update dependency @stylistic/eslint-plugin to v4.4.1 ([#101](https://github.com/webstreamr/webstreamr/issues/101)) ([3894614](https://github.com/webstreamr/webstreamr/commit/389461415d74f4c58d16ea81215565fd8e31022b))
* log response headers for blocks ([d78dca3](https://github.com/webstreamr/webstreamr/commit/d78dca3345510b3e30b5d743b78386be803da9ce))

## [0.22.8](https://github.com/webstreamr/webstreamr/compare/v0.22.7...v0.22.8) (2025-06-03)


### Miscellaneous Chores

* add more error infos to results ([ef2c45e](https://github.com/webstreamr/webstreamr/commit/ef2c45e2cba6b714f1a54ae53bfb6d28f58d9a3f))
* implement queued fetching ([f0817a3](https://github.com/webstreamr/webstreamr/commit/f0817a3dd6fd5a09eff96316d8ee04b88d0be592))

## [0.22.7](https://github.com/webstreamr/webstreamr/compare/v0.22.6...v0.22.7) (2025-06-03)


### Miscellaneous Chores

* add language name to config in manifest as well ([ae6fdfe](https://github.com/webstreamr/webstreamr/commit/ae6fdfe726c6ff4a9458b3dbdc1b8a05f9bbc74f))
* catch handler blocked errors and report the and report themm ([9d17f53](https://github.com/webstreamr/webstreamr/commit/9d17f5340a4074993fdef0080693e4140a28b36f))
* **deps:** update dependency typescript-eslint to v8.33.1 ([#97](https://github.com/webstreamr/webstreamr/issues/97)) ([f0ffd9b](https://github.com/webstreamr/webstreamr/commit/f0ffd9b0249703095524783af9006cd3716a86a2))
* try to log error causes ([f6967da](https://github.com/webstreamr/webstreamr/commit/f6967da5cc86897ff49d068bb6ad5ddd9d12f498))
* use tsconfig base for node 22 ([b94f989](https://github.com/webstreamr/webstreamr/commit/b94f9898b044535bcc5f5377b3bdba61ee3e933e))


### Bug Fixes

* **handler:** use new frembed domain (again) ([0b9cf21](https://github.com/webstreamr/webstreamr/commit/0b9cf21faebad17ca6395160f7621bd8b29b5c0b))

## [0.22.6](https://github.com/webstreamr/webstreamr/compare/v0.22.5...v0.22.6) (2025-06-02)


### Miscellaneous Chores

* improve results format and refactor name/title generation ([e4dd16e](https://github.com/webstreamr/webstreamr/commit/e4dd16e9d1e500dbcb7cc0b33cf7e26c480f9674))

## [0.22.5](https://github.com/webstreamr/webstreamr/compare/v0.22.4...v0.22.5) (2025-06-02)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#93](https://github.com/webstreamr/webstreamr/issues/93)) ([dbf1dd1](https://github.com/webstreamr/webstreamr/commit/dbf1dd1fb9bcb7efa21cb294a23b739a1763d57e))
* **deps:** update dependency @types/node to v22.15.29 ([#92](https://github.com/webstreamr/webstreamr/issues/92)) ([d04c928](https://github.com/webstreamr/webstreamr/commit/d04c9280dfbc685a0f2d38c087d9c5df787ad03d))


### Bug Fixes

* **handler:** use new frembed domain ([e86b5c3](https://github.com/webstreamr/webstreamr/commit/e86b5c3454125f76d1a5e90fe904e3d01e26b6c3))


### Tests

* fix mocked Fetcher real calls by using same headers ([12d91ba](https://github.com/webstreamr/webstreamr/commit/12d91ba0b44e5822210aca0b5087f2d272420072))

## [0.22.4](https://github.com/webstreamr/webstreamr/compare/v0.22.3...v0.22.4) (2025-06-01)


### Miscellaneous Chores

* generalize forbidden/blocked handling ([2eb09fc](https://github.com/webstreamr/webstreamr/commit/2eb09fc65a1f0141abd1f9760c39cb454de00496))


### Bug Fixes

* **fetcher:** use "node" as user agent explicitly ([c3a2f9f](https://github.com/webstreamr/webstreamr/commit/c3a2f9fdc6c543baf7db058ce7653877deff65ef))
* **handler:** disable Eurostreaming as long as it doesn't work ([cd8ff60](https://github.com/webstreamr/webstreamr/commit/cd8ff605082e12ae3aee2509a3c0f2bf7ecadbb3))

## [0.22.3](https://github.com/webstreamr/webstreamr/compare/v0.22.2...v0.22.3) (2025-06-01)


### Miscellaneous Chores

* **fetcher:** hardcode user-agent for now to avoid using "node" ([424ed78](https://github.com/webstreamr/webstreamr/commit/424ed78b934ebcff8e80ff72d6988847bd6742f1))

## [0.22.2](https://github.com/webstreamr/webstreamr/compare/v0.22.1...v0.22.2) (2025-06-01)


### Miscellaneous Chores

* **fetcher:** add response header info to non-expected errors ([717019e](https://github.com/webstreamr/webstreamr/commit/717019e04e5d171779b3585ccb1cd8ce8203c32a))
* **fetcher:** remove Origin header ([ca98122](https://github.com/webstreamr/webstreamr/commit/ca981220c91cfc732185f925d0ca544ccbc255af))

## [0.22.1](https://github.com/webstreamr/webstreamr/compare/v0.22.0...v0.22.1) (2025-05-31)


### Miscellaneous Chores

* **deps:** update eslint monorepo to v9.28.0 ([#85](https://github.com/webstreamr/webstreamr/issues/85)) ([2f9a349](https://github.com/webstreamr/webstreamr/commit/2f9a349d31f995d4a8bae56c590d49a8d17b0d29))


### Bug Fixes

* switch back to fetch and do not generate user agents ([fbc1aa9](https://github.com/webstreamr/webstreamr/commit/fbc1aa994c091a39a97c48d417e32afbe63f78d9))

## [0.22.0](https://github.com/webstreamr/webstreamr/compare/v0.21.0...v0.22.0) (2025-05-29)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#79](https://github.com/webstreamr/webstreamr/issues/79)) ([17b6d79](https://github.com/webstreamr/webstreamr/commit/17b6d79157b2ed86148951c86f5f6dfd1b8c434c))
* **deps:** update dependency @types/node to v22.15.21 ([#78](https://github.com/webstreamr/webstreamr/issues/78)) ([19d7a8b](https://github.com/webstreamr/webstreamr/commit/19d7a8b9ddecfa333ec6fa1b7196084f113896ed))
* **deps:** update dependency typescript-eslint to v8.33.0 ([#82](https://github.com/webstreamr/webstreamr/issues/82)) ([62098f8](https://github.com/webstreamr/webstreamr/commit/62098f8e845b51dbed774e40babf382fbac2aa2c))
* **fetcher:** reduce timeout to 5s ([5bfe2f8](https://github.com/webstreamr/webstreamr/commit/5bfe2f800b372d6ca5ca9d42f307c77bede3d4e5))
* **fetcher:** set more headers to mimick browser requests ([07ddaab](https://github.com/webstreamr/webstreamr/commit/07ddaab7fb8a8818d6e0f60ee4d701430bd28178))
* **fetcher:** use more realistic referer/origin header values ([02b73b4](https://github.com/webstreamr/webstreamr/commit/02b73b41d7ea08f299907510cfe88daa7ad25d9c))


### Features

* make external URL exclusion configurable ([799ca97](https://github.com/webstreamr/webstreamr/commit/799ca975ac9873bbeff6c6d73b58eb04176b8901))


### Bug Fixes

* detect and report Cloudflare challenge blocks ([0638ce0](https://github.com/webstreamr/webstreamr/commit/0638ce0a8c4791c781da49735d19ea864a5df13a))


### Code Refactoring

* **handler:** remove not needed 404 special handling ([862d3bb](https://github.com/webstreamr/webstreamr/commit/862d3bb5f23c32dcf4f4e3399a9a79e28a66ab12))


### Tests

* remove duplicated Fetcher test parts ([f2a7da2](https://github.com/webstreamr/webstreamr/commit/f2a7da21e0153213a62933d6a3b35768d548931e))

## [0.21.0](https://github.com/webstreamr/webstreamr/compare/v0.20.1...v0.21.0) (2025-05-25)


### Miscellaneous Chores

* **deps:** update dependency @stylistic/eslint-plugin to v4.3.0 ([#75](https://github.com/webstreamr/webstreamr/issues/75)) ([61a17b1](https://github.com/webstreamr/webstreamr/commit/61a17b1d1c00c99ebd993645a8f87f4558b9dfba))
* **deps:** update dependency @stylistic/eslint-plugin to v4.4.0 ([#77](https://github.com/webstreamr/webstreamr/issues/77)) ([9e9d4b2](https://github.com/webstreamr/webstreamr/commit/9e9d4b20811a2eab6e82a7607cd3f727d179ef2f))


### Features

* add title to meta, restructure result name ([d4e402e](https://github.com/webstreamr/webstreamr/commit/d4e402e5c958572822bb6d2885c2206bc75ffc52))
* **extractor:** cache not found results too ([6b5c9a4](https://github.com/webstreamr/webstreamr/commit/6b5c9a4ce70e49eac9668cbd60f4409da8285ac6))


### Code Refactoring

* introduce type for CountryCode ([f27fc6c](https://github.com/webstreamr/webstreamr/commit/f27fc6c38a4ba013f67824f40ca8aed1e07c5f1e))
* move bytes, height and countryCode into meta object ([979dddd](https://github.com/webstreamr/webstreamr/commit/979dddd20c00381d6cb34530acc901f095b2f94e))


### Tests

* update fetch fixtures only when requested ([faa6eb6](https://github.com/webstreamr/webstreamr/commit/faa6eb6ed772cf9ed00cab24aa268137d98ace6c))

## [0.20.1](https://github.com/webstreamr/webstreamr/compare/v0.20.0...v0.20.1) (2025-05-23)


### Miscellaneous Chores

* better handle not found streams/links ([8e791bb](https://github.com/webstreamr/webstreamr/commit/8e791bbe2463ad12f30ff8165a63c85fba2e2588))
* **deps:** update node.js to v22.16.0 ([#72](https://github.com/webstreamr/webstreamr/issues/72)) ([305ce3d](https://github.com/webstreamr/webstreamr/commit/305ce3d873e4103096343a4936e81893f9eb6526))
* **extractor:** use HEAD instead of GET to check external URLs ([0a99f1e](https://github.com/webstreamr/webstreamr/commit/0a99f1e5011d23e546ef372e61dd8acc7b789236))
* **fetcher:** set Origin header and add back proxy headers ([b313c4e](https://github.com/webstreamr/webstreamr/commit/b313c4eb8d37e75f869216fa2899565a2b32098f))
* log IP in stream request ([5c51abb](https://github.com/webstreamr/webstreamr/commit/5c51abbd46f850ce22ac03f7ac207b7ad62dadd6))
* reduce axios retries to 1 again, avoid risky retries ([1447ada](https://github.com/webstreamr/webstreamr/commit/1447adad1b92a17fcc2bb699c88532fd7c290607))


### Bug Fixes

* **handler:** do not ignore main link in Eurostreaming ([f4a0b03](https://github.com/webstreamr/webstreamr/commit/f4a0b0324611399f26fb160b19ea2441cd8faaee))


### Tests

* do not reset but only clear mocks ([1e9ebd5](https://github.com/webstreamr/webstreamr/commit/1e9ebd5905eb7a67074593e9efdb92e3f0c092d1))

## [0.20.0](https://github.com/webstreamr/webstreamr/compare/v0.19.4...v0.20.0) (2025-05-21)


### Features

* **extractor:** add external URL support ([23445c1](https://github.com/webstreamr/webstreamr/commit/23445c143b3f670bdcd60308e83fbfcf07239f86))


### Tests

* use snapshots, also use fixtures for axios errors ([e90c89a](https://github.com/webstreamr/webstreamr/commit/e90c89af89347561a8c61ea004ac725674f30aa5))

## [0.19.4](https://github.com/webstreamr/webstreamr/compare/v0.19.3...v0.19.4) (2025-05-21)


### Bug Fixes

* **handler:** return only results for configured country/language in CineHDPlus ([ac8dd43](https://github.com/webstreamr/webstreamr/commit/ac8dd436623f23f3f496354d99faf697b1c13033))

## [0.19.3](https://github.com/webstreamr/webstreamr/compare/v0.19.2...v0.19.3) (2025-05-20)


### Miscellaneous Chores

* **fetcher:** increase timeout to 15s ([#64](https://github.com/webstreamr/webstreamr/issues/64)) ([8daabf1](https://github.com/webstreamr/webstreamr/commit/8daabf1f5af0d305f71880b7e16fcc5182001a82))

## [0.19.2](https://github.com/webstreamr/webstreamr/compare/v0.19.1...v0.19.2) (2025-05-19)


### Miscellaneous Chores

* **deps:** update dependency @types/express to v5.0.2 ([#61](https://github.com/webstreamr/webstreamr/issues/61)) ([ba57833](https://github.com/webstreamr/webstreamr/commit/ba57833fb0d9c9af791acbce1a3a68f19bdf5ae1))
* **deps:** update dependency @types/node to v22.15.19 ([#62](https://github.com/webstreamr/webstreamr/issues/62)) ([1cc2a18](https://github.com/webstreamr/webstreamr/commit/1cc2a182a5d57251e39cb17a9b6cf05258ceb478))
* **fetcher:** remove proxy headers, add default timeout ([c2c5331](https://github.com/webstreamr/webstreamr/commit/c2c5331861e22a83bcc77da451c57d715313bceb))

## [0.19.1](https://github.com/webstreamr/webstreamr/compare/v0.19.0...v0.19.1) (2025-05-18)


### Reverts

* "feat(extractor): implement UQLoad" ([57799a7](https://github.com/webstreamr/webstreamr/commit/57799a777af4d0da4ceda65d6b4f2591c4c207b5))

## [0.19.0](https://github.com/webstreamr/webstreamr/compare/v0.18.0...v0.19.0) (2025-05-18)


### Features

* **extractor:** implement UQLoad ([fb61d39](https://github.com/webstreamr/webstreamr/commit/fb61d3922566b9fbcdeb295dc30c041c356586fc))
* implement IMDb -&gt; TMDB ID conversion helper ([03cb05e](https://github.com/webstreamr/webstreamr/commit/03cb05e2a369fe5741a690e0c1fc374ddc5e5a01))


### Code Refactoring

* **extractor:** manipulate URL instead of creating new one ([b5c45d8](https://github.com/webstreamr/webstreamr/commit/b5c45d806e13639a986e152adc00002968d54e43))
* **handler:** switch Frembed to TMDB search which is more reliable ([d8a19d4](https://github.com/webstreamr/webstreamr/commit/d8a19d491627575eda36acc18e30254d829a57b7))

## [0.18.0](https://github.com/webstreamr/webstreamr/compare/v0.17.0...v0.18.0) (2025-05-17)


### Miscellaneous Chores

* **manifest:** add stremio-addons.net signature ([ac4ded4](https://github.com/webstreamr/webstreamr/commit/ac4ded4614328417222d937be30588236b359ebf))


### Features

* configure languages instead of handlers ([5b389ad](https://github.com/webstreamr/webstreamr/commit/5b389ada9e78d51d53b9a5cc5dcc24c27c826deb))

## [0.17.0](https://github.com/webstreamr/webstreamr/compare/v0.16.1...v0.17.0) (2025-05-17)


### Miscellaneous Chores

* create ID per request for logging and error response ([f635d6c](https://github.com/webstreamr/webstreamr/commit/f635d6c2330ad4e0cf2ce743092536acbf6f97ee))


### Documentation

* add basic README ([827fd88](https://github.com/webstreamr/webstreamr/commit/827fd881108970f3308a13f664009cab40fdc3f8))
* add some badges to the README ([aac954c](https://github.com/webstreamr/webstreamr/commit/aac954cafc219f4273ba80e4e64cf4290bf54b0f))


### Features

* **handler:** limited Frembed support ([8b82215](https://github.com/webstreamr/webstreamr/commit/8b82215c321d7a45575e6efed7adcf74a625d656))


### Code Refactoring

* cleanup url and extractorRegistry variable/prop names ([4a705ce](https://github.com/webstreamr/webstreamr/commit/4a705ce0883f78940d03512b9432eb0aec8120e3))
* use template literal consistently ([f2fb482](https://github.com/webstreamr/webstreamr/commit/f2fb4821e3a4c9ee902c6f846197f8c0381f38e8))

## [0.16.1](https://github.com/webstreamr/webstreamr/compare/v0.16.0...v0.16.1) (2025-05-16)


### Reverts

* "feat(extractor): implement Mixdrop" ([bb395f0](https://github.com/webstreamr/webstreamr/commit/bb395f03759daaaeffced3d82aec1244c7598fdf))

## [0.16.0](https://github.com/webstreamr/webstreamr/compare/v0.15.2...v0.16.0) (2025-05-16)


### Miscellaneous Chores

* **deps:** update dependency @eslint/js to v9.27.0 ([#51](https://github.com/webstreamr/webstreamr/issues/51)) ([8bc30b8](https://github.com/webstreamr/webstreamr/commit/8bc30b8234b2faa9fb0c755bfccddd4d2834844e))
* **deps:** update dependency eslint to v9.27.0 ([#52](https://github.com/webstreamr/webstreamr/issues/52)) ([16b01a5](https://github.com/webstreamr/webstreamr/commit/16b01a57fd95ad2fbf35d8307d71c659b9c4fc63))
* **deps:** update dependency ts-jest to v29.3.4 ([#50](https://github.com/webstreamr/webstreamr/issues/50)) ([6027332](https://github.com/webstreamr/webstreamr/commit/60273329ab25dc31e276b9ab80a281b827911d18))
* rename behaviourHints to behaviorHints 🤦 ([e06b8a2](https://github.com/webstreamr/webstreamr/commit/e06b8a2d95ee7c2e1ce2e6634bad099fc9602b2e))
* return stream.behaviorHints.videoSize when possible ([07ffe44](https://github.com/webstreamr/webstreamr/commit/07ffe444f3799f54b346fb20bd8735ed1810897e))


### Features

* **extractor:** implement Mixdrop ([4c53161](https://github.com/webstreamr/webstreamr/commit/4c53161e98ca6ea24bdc76ba22fdf16785044f2c))


### Bug Fixes

* **extractor:** do not throw for broken/outdated link ([63a79f8](https://github.com/webstreamr/webstreamr/commit/63a79f87588bdfc46f72e7c2b01f8a63da9d1c1f))


### Code Refactoring

* **extractor:** improve DoodStream comment about no match case ([24f1107](https://github.com/webstreamr/webstreamr/commit/24f1107df8a0a3a5d621b64037d1ca1ae66bdf8c))
* use url.href instead of url.toString() ([b790cc7](https://github.com/webstreamr/webstreamr/commit/b790cc79543fecf31a24222d1537ae03c03b8d2c))

## [0.15.2](https://github.com/webstreamr/webstreamr/compare/v0.15.1...v0.15.2) (2025-05-16)


### Miscellaneous Chores

* compare by label if both height and bytes are the same ([e13ab0c](https://github.com/webstreamr/webstreamr/commit/e13ab0c70ffe7546c3c2a9764def7bf7b697f706))

## [0.15.1](https://github.com/webstreamr/webstreamr/compare/v0.15.0...v0.15.1) (2025-05-16)


### Bug Fixes

* rename `behaviourHints.group` to `behaviourHints.bingeGroup` ([241e6b0](https://github.com/webstreamr/webstreamr/commit/241e6b0b7745bf3413e1681fb7346a3adc2597ca))

## [0.15.0](https://github.com/webstreamr/webstreamr/compare/v0.14.1...v0.15.0) (2025-05-16)


### Features

* **extractor:** try to semi-blindly implement DoodStream support ([8740979](https://github.com/webstreamr/webstreamr/commit/8740979a8097cf7dcbd0bcb1cfdb22463ec4cedb))


### Code Refactoring

* **extractor:** remove embed part from extractor ([87ec328](https://github.com/webstreamr/webstreamr/commit/87ec328a66f5b0cdb5870e5149d687bb788c810a))
* **fetcher:** use origin for the referrer ([938f6cb](https://github.com/webstreamr/webstreamr/commit/938f6cb2c3224b9079e40c11e8cc63252801b9de))

## [0.14.1](https://github.com/webstreamr/webstreamr/compare/v0.14.0...v0.14.1) (2025-05-15)


### Miscellaneous Chores

* add missing dot after GitHub link ([91a6935](https://github.com/webstreamr/webstreamr/commit/91a6935a91e08ab6d99c9fd119e46c6c832c6065))
* **deps:** update dependency ts-jest to v29.3.3 ([#44](https://github.com/webstreamr/webstreamr/issues/44)) ([acd29d8](https://github.com/webstreamr/webstreamr/commit/acd29d8f39b2c84e613d82832e9269b73fa07240))


### Bug Fixes

* add back cache-control headers ([c1da2d5](https://github.com/webstreamr/webstreamr/commit/c1da2d5552b8b9f7e64d21bcc3984975b7210e36))
* **fetcher:** do not overwrite config ([e8ed101](https://github.com/webstreamr/webstreamr/commit/e8ed101176bda776b1650ed1d561affa8070963c))

## [0.14.0](https://github.com/webstreamr/webstreamr/compare/v0.13.0...v0.14.0) (2025-05-14)


### Miscellaneous Chores

* **fetcher:** always set same URL host as referer ([281cba8](https://github.com/webstreamr/webstreamr/commit/281cba8da188eaf3136fdaed08fc836ac1dabf15))


### Features

* **fetcher:** retry all 4xx requests too ([728bc7e](https://github.com/webstreamr/webstreamr/commit/728bc7ecba01e3dce80cf9e234b752cecdf6db34))


### Code Refactoring

* **handler:** also pass content type to handle() ([956ba68](https://github.com/webstreamr/webstreamr/commit/956ba68550776d6888acb47d01bbe1c690198e36))

## [0.13.0](https://github.com/webstreamr/webstreamr/compare/v0.12.0...v0.13.0) (2025-05-14)


### Features

* **handler:** add CineHDPlus (es/mx series) ([7f26047](https://github.com/webstreamr/webstreamr/commit/7f2604725021e8ba1ce6befd1ec837d2a9931d9b))
* **handler:** add Eurostream (it series) ([c6d9bfb](https://github.com/webstreamr/webstreamr/commit/c6d9bfb01b5831de8fad10cd6edfa84b837463b5))

## [0.12.0](https://github.com/webstreamr/webstreamr/compare/v0.11.2...v0.12.0) (2025-05-13)


### Miscellaneous Chores

* **extractor:** log more infos ([349c26c](https://github.com/webstreamr/webstreamr/commit/349c26c9b53495b10b7836f92fc8ab9868f167ae))


### Features

* **fetcher:** add retry capability using axios-retry ([1c1ffcd](https://github.com/webstreamr/webstreamr/commit/1c1ffcd19b37d6b24c93677fc30b35b44e64cab2))

## [0.11.2](https://github.com/webstreamr/webstreamr/compare/v0.11.1...v0.11.2) (2025-05-13)


### Code Refactoring

* **fetcher:** switch to axios for hopefully better errors ([41d2f23](https://github.com/webstreamr/webstreamr/commit/41d2f238129125d548fde7930f55a74fb712087d))

## [0.11.1](https://github.com/webstreamr/webstreamr/compare/v0.11.0...v0.11.1) (2025-05-13)


### Miscellaneous Chores

* add link to GitHub on configure page, improve content type info ([1be7564](https://github.com/webstreamr/webstreamr/commit/1be75645d3cb9da507b8636453d21e6519cdaacc))

## [0.11.0](https://github.com/webstreamr/webstreamr/compare/v0.10.1...v0.11.0) (2025-05-13)


### Miscellaneous Chores

* **deps:** update dependency typescript-eslint to v8.32.1 ([#37](https://github.com/webstreamr/webstreamr/issues/37)) ([11fa19c](https://github.com/webstreamr/webstreamr/commit/11fa19c1650a0b9dc5a294ecb4d67a9727f1495b))
* **manifest:** don't show language codes next to flags ([ce6aca5](https://github.com/webstreamr/webstreamr/commit/ce6aca5c776b76c06184cab4be9caa9059b40788))


### Features

* **handler:** return handler issues as streams for better visibility ([d4db807](https://github.com/webstreamr/webstreamr/commit/d4db80789a1a8648d01f9a08d4f74f91e2d91b38))


### Code Refactoring

* extract stream resolving and add tests ([5665c6a](https://github.com/webstreamr/webstreamr/commit/5665c6a6ff375e0600eb2a7c4b7cb3e5ca768a5a))
* **routes:** use router via controllers ([15a53de](https://github.com/webstreamr/webstreamr/commit/15a53de504d19e321b8ca233b539269e63a914f4))
* simplify embed extractor handling and hide away internals ([68a7a41](https://github.com/webstreamr/webstreamr/commit/68a7a41606fe84c23f9484cdb253288d6afb09f6))

## [0.10.1](https://github.com/webstreamr/webstreamr/compare/v0.10.0...v0.10.1) (2025-05-12)


### Bug Fixes

* remove cache-control headers ([4da2567](https://github.com/webstreamr/webstreamr/commit/4da2567ab21ff16ebc068326e07e5190d6a66a2b))

## [0.10.0](https://github.com/webstreamr/webstreamr/compare/v0.9.0...v0.10.0) (2025-05-12)


### Features

* **handler:** add VerHdLink ([44e140c](https://github.com/webstreamr/webstreamr/commit/44e140c696178075e1cafc79a788ae477ebb702d))


### Bug Fixes

* add language to sourceId for better grouping / binge watching ([3d4129f](https://github.com/webstreamr/webstreamr/commit/3d4129fbd9575c8227a98c6c094ff7fc9ace78e9))


### Code Refactoring

* rename language to countryCode to avoid confusion ([8ba6fdb](https://github.com/webstreamr/webstreamr/commit/8ba6fdb5dff1a946b9f4eedaeb7538539a342491))


### Tests

* **handler:** use correct name in describe block ([9145e9c](https://github.com/webstreamr/webstreamr/commit/9145e9c3f69c474b1e18448eb1e10876a2e7fb2a))

## [0.9.0](https://github.com/webstreamr/webstreamr/compare/v0.8.0...v0.9.0) (2025-05-12)


### Features

* **handler:** add MostraGuarda ([02c9ae3](https://github.com/webstreamr/webstreamr/commit/02c9ae3b1b7b384a4c3a98861b4a26e32b40ed5e))
* **manifest:** show supported content types for each config/handler ([23eb87e](https://github.com/webstreamr/webstreamr/commit/23eb87e9db00d60b132527deb2815dd526be5212))

## [0.8.0](https://github.com/webstreamr/webstreamr/compare/v0.7.1...v0.8.0) (2025-05-12)


### Build System

* keep analysing test files but still ignore them for the build ([2128e26](https://github.com/webstreamr/webstreamr/commit/2128e2638a7a502cb136ca77c86012773f0c61d3))


### Miscellaneous Chores

* **logging:** simplify format definition, do nothing in test ([13520aa](https://github.com/webstreamr/webstreamr/commit/13520aa194ae2847c395fb3381171d38c097287b))


### Features

* **fetcher:** work only with URL objects, set 2 more proxy headers ([072ec4a](https://github.com/webstreamr/webstreamr/commit/072ec4ac0ac6b5a9b0358e57c154e7c70545b253))
* **handler:** add FrenchCloud ([9e74bd7](https://github.com/webstreamr/webstreamr/commit/9e74bd747b335b2354be7705a0325e85e1fd3207))


### Code Refactoring

* **handler:** remove unnecessary Promise.resolve() usage ([4cde860](https://github.com/webstreamr/webstreamr/commit/4cde8607cdd357ac2323e073e81368d0eecaada8))

## [0.7.1](https://github.com/webstreamr/webstreamr/compare/v0.7.0...v0.7.1) (2025-05-12)


### Code Refactoring

* drop logging helper in favor of winston using DI ([fc02420](https://github.com/webstreamr/webstreamr/commit/fc024209a7887fa4562d33a407d2ec662d2a5b56))
* make cache ttl configurable per embed extractor ([09ee685](https://github.com/webstreamr/webstreamr/commit/09ee685d22f1b6e79075ff60a5ac8f6865e927f6))
* simplify resolving of promises ([8d003dd](https://github.com/webstreamr/webstreamr/commit/8d003dd1740c9fcb5be582469156b199d3373fc4))
* use country-emoji library instead of custom helper ([89e5bb1](https://github.com/webstreamr/webstreamr/commit/89e5bb1978e1aec00aba4a25a8245f809cbb5033))

## [0.7.0](https://github.com/webstreamr/webstreamr/compare/v0.6.0...v0.7.0) (2025-05-12)


### Miscellaneous Chores

* **deps:** lock file maintenance ([#30](https://github.com/webstreamr/webstreamr/issues/30)) ([23d1238](https://github.com/webstreamr/webstreamr/commit/23d123851b9cf51d1bf1a0fb736af6606391d18a))
* limit to 5 concurrent fetch sockets ([1654c0b](https://github.com/webstreamr/webstreamr/commit/1654c0b920d6c6ba14195e25d4bc3b8c5d915172))
* **renovate:** limit updates of often-releasing packages a bit ([df6f14e](https://github.com/webstreamr/webstreamr/commit/df6f14ee6be0c0c43b293b9e69df9c43b559c7ea))


### Features

* send also X-Real-IP next to X-Forwarded-For ([b7a8fc4](https://github.com/webstreamr/webstreamr/commit/b7a8fc4e7602e0e4c100e2837a8328b46e011e0d))


### Bug Fixes

* **deps:** update dependency user-agents to v1.1.537 ([#31](https://github.com/webstreamr/webstreamr/issues/31)) ([1626cf0](https://github.com/webstreamr/webstreamr/commit/1626cf03ce777f5c51b9e51078e6ee9ad3a621fb))


### Code Refactoring

* better names for the cache properties ([0a57114](https://github.com/webstreamr/webstreamr/commit/0a57114c7d8e5d6c8944e4c8cbacaa2f795831d8))

## [0.6.0](https://github.com/webstreamr/webstreamr/compare/v0.5.0...v0.6.0) (2025-05-11)


### Features

* cache extractor results for 15 minutes ([8226d07](https://github.com/webstreamr/webstreamr/commit/8226d0755a559573cee1e49f27b26f29642d9f00))
* introduce Context and use it to set X-Forwarded-For in requests ([efef039](https://github.com/webstreamr/webstreamr/commit/efef039cde99dec2f12e96f7fcf574fa6fd2373d))
* introduce custom UrlResult which will be transformed to Stream ([ee0efa5](https://github.com/webstreamr/webstreamr/commit/ee0efa540996aa2e779f5a7913801cb3e8ee4040))
* use randomized user agent for fetch ([b114ac1](https://github.com/webstreamr/webstreamr/commit/b114ac11b73b2445f227c136f9e6dbd7d1d833ec))


### Bug Fixes

* improve height and bytes types ([477c3d1](https://github.com/webstreamr/webstreamr/commit/477c3d1ff9ae8aff54acc6e132450be52f72e6a6))


### Code Refactoring

* DI for handlers, extractors and fetcher ([96dde8a](https://github.com/webstreamr/webstreamr/commit/96dde8a6346db5eaa82e524cb40a9c22f3a63387))
* use URL instead of string where possible ([4787a13](https://github.com/webstreamr/webstreamr/commit/4787a1323d8ec4dcbdccc2848d44624ab099455c))

## [0.5.0](https://github.com/webstreamr/webstreamr/compare/v0.4.1...v0.5.0) (2025-05-10)


### Features

* extract embed handling ([f62fa94](https://github.com/webstreamr/webstreamr/commit/f62fa944bbec3150c48423e6a19e1b1e5ac7f786))


### Bug Fixes

* use correct index path in Dockerfile ([841f2a0](https://github.com/webstreamr/webstreamr/commit/841f2a0811c53762e59f6bf7256b9c60d5db379d))


### Tests

* improve fetch fixture handling ([05c0163](https://github.com/webstreamr/webstreamr/commit/05c0163874a8d3986be4a6e8132d26ecc00d6678))

## [0.4.1](https://github.com/webstreamr/webstreamr/compare/v0.4.0...v0.4.1) (2025-05-09)


### Bug Fixes

* keep replacing the manifest version on release ([6619bfb](https://github.com/webstreamr/webstreamr/commit/6619bfb755d135259b9355fcc3b277b34da7cd8c))

## [0.4.0](https://github.com/webstreamr/webstreamr/compare/v0.3.0...v0.4.0) (2025-05-09)


### Miscellaneous Chores

* npm dedupe ([3ecb811](https://github.com/webstreamr/webstreamr/commit/3ecb8119eda0900120e853e56e12d31405e12ca0))


### Features

* drop stremio-addon-sdk ([#24](https://github.com/webstreamr/webstreamr/issues/24)) ([66a70dc](https://github.com/webstreamr/webstreamr/commit/66a70dc22d997f0d68dc00a71ab6dfa24efd5c59))

## [0.3.0](https://github.com/webstreamr/webstreamr/compare/v0.2.1...v0.3.0) (2025-05-09)


### Features

* add support for configuring manifest description via env var ([193f815](https://github.com/webstreamr/webstreamr/commit/193f81593a5c4c57151014b895ebc911c2b3710f))

## [0.2.1](https://github.com/webstreamr/webstreamr/compare/v0.2.0...v0.2.1) (2025-05-08)


### Build System

* **docker:** clean-up needed env vars, use sane defaults ([#21](https://github.com/webstreamr/webstreamr/issues/21)) ([639f945](https://github.com/webstreamr/webstreamr/commit/639f9452ab87a86ae441d81854ff5b86f12ee7f2))

## [0.2.0](https://github.com/webstreamr/webstreamr/compare/v0.1.0...v0.2.0) (2025-05-08)


### Miscellaneous Chores

* add a build workflow to ensure the Dockerfile is alright ([#4](https://github.com/webstreamr/webstreamr/issues/4)) ([1f364fc](https://github.com/webstreamr/webstreamr/commit/1f364fcba4ee1a37f633c658c8f7d8205ba15821))
* align github action files better ([c73c58b](https://github.com/webstreamr/webstreamr/commit/c73c58ba3c74769722b2d12f5fbb52095bdcde74))
* configure Release Please ([26b19b0](https://github.com/webstreamr/webstreamr/commit/26b19b01b556e93cf6922e4ea30fe2be596268c6))
* Configure Renovate ([#1](https://github.com/webstreamr/webstreamr/issues/1)) ([7b9f3cb](https://github.com/webstreamr/webstreamr/commit/7b9f3cb0845c90423b20a67dccae05913a47f508))
* **deps:** lock file maintenance ([#5](https://github.com/webstreamr/webstreamr/issues/5)) ([27aa1ad](https://github.com/webstreamr/webstreamr/commit/27aa1adff1bae0f91138eb026e325e473fd508ae))
* **deps:** update dependency @types/node to v22.15.16 ([#3](https://github.com/webstreamr/webstreamr/issues/3)) ([9c8874f](https://github.com/webstreamr/webstreamr/commit/9c8874f52fa875419a7735aeecb10c9c24a4ebbe))
* **deps:** update dependency @types/node to v22.15.17 ([#6](https://github.com/webstreamr/webstreamr/issues/6)) ([e063d71](https://github.com/webstreamr/webstreamr/commit/e063d71710e9bbfae7bfe0bc6eb3589f67c49c30))
* fine-tune renovate config ([b771cee](https://github.com/webstreamr/webstreamr/commit/b771ceee4991719436a754f36aecb24eccec165d))
* improve description ([828d0cd](https://github.com/webstreamr/webstreamr/commit/828d0cd590b4aed237491dd1b0026a69c9f4fbae))
* initial commit ([1494b25](https://github.com/webstreamr/webstreamr/commit/1494b2524e4a9697e6eedfba163baf1f26cc4fcb))
* opt-in to more Renovate features, e.g. automerge ([00b302a](https://github.com/webstreamr/webstreamr/commit/00b302a4781979b3ecfaf8d76981bd0993735cc1))
* remove unnecessary TS allows ([bf84233](https://github.com/webstreamr/webstreamr/commit/bf8423395fd029eaed03da75f6c9df038f64ea55))
* remove unused packages and jest cache ([44a60f7](https://github.com/webstreamr/webstreamr/commit/44a60f7c69f52e3dfc3b1855a7a4d886cd86bade))


### Features

* introduce MANIFEST_VERSION env var ([#7](https://github.com/webstreamr/webstreamr/issues/7)) ([3078e02](https://github.com/webstreamr/webstreamr/commit/3078e02b4b9b1b3bca2d46c656d8177e0d847978))
* switch to node-alpine ([98d391f](https://github.com/webstreamr/webstreamr/commit/98d391ff79d5018d6e9318589d49f98f02f7273c))


### Code Refactoring

* make resolution and size optional and extract resolution helper ([3a87ddb](https://github.com/webstreamr/webstreamr/commit/3a87ddb9f0072a1478d7d4d9fcf27be697530b2c))
* transform handlers to classes, improve config generation ([afec515](https://github.com/webstreamr/webstreamr/commit/afec515287df8bcba0ead6706f63724fe7a5ac4e))


### Tests

* simplify embed expectation ([b9303dc](https://github.com/webstreamr/webstreamr/commit/b9303dc8cedd3d1983f89f09f72b5b71e8b64118))
