import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let details: Record<string, string> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const respBody = exceptionResponse as { message: string | string[] };

        if (Array.isArray(respBody.message)) {
          message = 'Datos de entrada inválidos';
          details = this.extractValidationErrors(respBody.message);
        } else {
          message = respBody.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      console.error(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Error interno del servidor';
    }

    const errorResponse: ErrorResponse = {
      timestamp: new Date().toISOString(),
      status,
      error: HttpStatus[status] || 'Internal Server Error',
      message,
      path: request.url,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(
    messages: (string | Record<string, any>)[],
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    messages.forEach((msg) => {
      if (typeof msg === 'string') {
        const parts = msg.split(' ');
        errors[parts[0]] = msg;
      } else if (
        typeof msg === 'object' &&
        msg !== null &&
        'property' in msg &&
        'constraints' in msg
      ) {
        const constraintMsg = msg as {
          property: string;
          constraints: Record<string, string>;
        };
        const firstConstraint = Object.values(constraintMsg.constraints)[0];
        errors[constraintMsg.property] = firstConstraint;
      }
    });

    return errors;
  }
}
