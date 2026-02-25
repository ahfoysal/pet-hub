import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(AllWsExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof WsException) {
      const error = exception.getError();
      message =
        typeof error === 'string'
          ? error
          : ((error as any)?.message ?? message);

      code = 'WS_EXCEPTION';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Custom logging
    this.logger.error(
      `WS Error: ${message}`,
      exception instanceof Error ? exception.stack : undefined
    );

    // Custom client payload
    client.emit('error', {
      status: 'error',
      code,
      message,
    });

    // ✅ Delegate to NestJS base filter
    super.catch(exception, host);
  }
}
