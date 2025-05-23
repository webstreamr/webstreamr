# Changelog

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
