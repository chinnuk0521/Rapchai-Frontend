/**
 * Comprehensive logging utility for authentication and onboarding flows
 * Provides consistent logging format with prefixes and table support
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${this.prefix}] [${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  info(message: string, data?: LogData): void {
    const formattedMessage = this.formatMessage('info', message);
    if (data) {
      console.log(formattedMessage, data);
    } else {
      console.log(formattedMessage);
    }
  }

  warn(message: string, data?: LogData): void {
    const formattedMessage = this.formatMessage('warn', message);
    if (data) {
      console.warn(formattedMessage, data);
    } else {
      console.warn(formattedMessage);
    }
  }

  error(message: string, error?: any): void {
    const formattedMessage = this.formatMessage('error', message);
    if (error) {
      console.error(formattedMessage, error);
    } else {
      console.error(formattedMessage);
    }
  }

  debug(message: string, data?: LogData): void {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('debug', message);
      if (data) {
        console.log(formattedMessage, data);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  table(label: string, data: LogData): void {
    console.log(`[${this.prefix}] ${label}:`);
    console.table(data);
  }

  group(label: string): void {
    console.group(`[${this.prefix}] ${label}`);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  click(action: string, data?: LogData): void {
    this.info(`🔘 CLICK: ${action}`, data);
  }

  stateChange(property: string, oldValue: any, newValue: any): void {
    this.info(`🔄 STATE CHANGE: ${property}`, {
      old: oldValue,
      new: newValue,
    });
  }

  navigation(from: string, to: string, method: string = 'push'): void {
    this.info(`🧭 NAVIGATION: ${method}`, {
      from,
      to,
      method,
    });
  }
}

// Export logger instances for different modules
export const onboardingLogger = new Logger('ONBOARDING');
export const authModalLogger = new Logger('AUTH_MODAL');
export const customerAuthLogger = new Logger('CUSTOMER_AUTH');
export const authCallbackLogger = new Logger('AUTH_CALLBACK');
export const hashHandlerLogger = new Logger('HASH_HANDLER');

