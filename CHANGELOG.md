# Changelog

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
