import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

export interface TenantRequest extends FastifyRequest {
  tenantSlug: string | null;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: TenantRequest, _res: FastifyReply, next: () => void) {
    const rawHost = (req.headers.host || '').toLowerCase();
    const hostname = rawHost.split(':')[0];

    const baseDomain = (process.env.BASE_DOMAIN || 'rifaspro.local').toLowerCase();

    const isBaseDomain =
      hostname === baseDomain || hostname.endsWith('.' + baseDomain);

    if (isBaseDomain) {
      const sub = hostname
        .slice(0, hostname.length - baseDomain.length)
        .replace(/\.$/, '');
      req.tenantSlug = sub.length > 0 ? sub : null;
    } else {
      req.tenantSlug =
        ((req.query as any)?.tenant as string) ||
        ((req.headers['x-tenant'] as string) || null);
    }

    next();
  }
}