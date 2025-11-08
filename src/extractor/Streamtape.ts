public supports(ctx: Context, url: URL): boolean {
    const supportedDomain
      = null !== url.host.match(/streamtape/)
      || [
          'strtape.cloud',
          'streamta.pe',
          'strcloud.link',
          'strcloud.club',
          'strtpe.link',
          'scloud.online',
          'stape.fun',
          'streamadblockplus.com',
          'shavetape.cash',
          'streamta.site',
          'streamadblocker.xyz',
          'tapewithadblock.org',
          'adblocktape.wiki',
          'antiadtape.com',
          'tapeblocker.com',
          'streamnoads.com',
          'tapeadvertisement.com',
          'tapeadsenjoyer.com',
          'watchadsontape.com',
        ].includes(url.host);

    return supportedDomain && supportsMediaFlowProxy(ctx);
  }