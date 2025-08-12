# Changelog

## [0.41.9](https://github.com/webstreamr/webstreamr/compare/v0.41.8...v0.41.9) (2025-08-12)


### Miscellaneous Chores

* clean-up critical error handling ([1a5cad4](https://github.com/webstreamr/webstreamr/commit/1a5cad40a2eedf1eb848157cb1944a8ca556d775))


### Bug Fixes

* **source:** keep using jsdom for now because of performance issues ([2d96e1d](https://github.com/webstreamr/webstreamr/commit/2d96e1db8fed5c4ce564cf81cb472d17c08fb44e))

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
