import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  getErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.error?.message) {
        return error.error.message;
      }
      
      // HTTP status code errors
      switch (error.status) {
        case 400:
          return 'Bad request. Please check your input and try again.';
        case 401:
          return 'You are not authorized. Please log in and try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 409:
          return 'This resource already exists. Please try with different information.';
        case 422:
          return 'The provided data is invalid. Please check your input.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Internal server error. Please try again later.';
        case 502:
          return 'Bad gateway. The server is temporarily unavailable.';
        case 503:
          return 'Service unavailable. Please try again later.';
        case 504:
          return 'Gateway timeout. The server took too long to respond.';
        default:
          return `An error occurred (${error.status}). Please try again.`;
      }
    }
    
    // Client-side error
    if (error?.message) {
      return error.message;
    }
    
    // Generic error
    return 'An unexpected error occurred. Please try again.';
  }

  logError(error: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const contextInfo = context ? ` [${context}]` : '';
    
    console.error(`${timestamp}${contextInfo}:`, error);
    
    // In production, you might want to send this to a logging service
    // this.sendToLoggingService(error, context);
  }

  private sendToLoggingService(error: any, context?: string): void {
    // Implementation for sending errors to external logging service
    // e.g., Sentry, LogRocket, etc.
  }
}