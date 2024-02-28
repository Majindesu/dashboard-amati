import "server-only"
import { appendFileSync } from "node:fs";
import { format } from 'date-fns';

class Logger {
    
    logDirectory: string;

    readonly severityLevels = {
        CRITICAL: 'CRITICAL',
        ERROR: 'ERROR',
        WARNING: 'WARNING',
    };

    constructor(){
        this.logDirectory = `${process.env.ERROR_LOG_PATH}`
    }

    getLogFileName(isError = false) {
        // Use a different naming convention for error logs if needed
        const suffix = isError ? '-error' : '';
        return `${format(new Date(), 'yyyy-MM-dd')}${suffix}.log`;
    }

    log(message: string, level = 'info') {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
        const isError = level === this.severityLevels.ERROR || level === this.severityLevels.CRITICAL || level === this.severityLevels.WARNING;
        const logFilePath = `${this.logDirectory}/${this.getLogFileName(isError)}`;
    
        appendFileSync(logFilePath, logMessage);
    }

    error(message: string, severity = 'ERROR') {
        // Ensure the severity level is valid; default to 'ERROR' if not
        if (!Object.values(this.severityLevels).includes(severity)) {
          severity = this.severityLevels.ERROR;
        }
        this.log(message, severity);
    }
}

const logger =  new Logger();

export default logger;
