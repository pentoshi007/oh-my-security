export interface ContentCleanupOptions {
    retentionDays?: number;
    dryRun?: boolean;
    verbose?: boolean;
}
export declare class ContentCleanupService {
    private contentDir;
    private retentionDays;
    private dryRun;
    private verbose;
    constructor(options?: ContentCleanupOptions);
    /**
     * Clean up old content files, keeping only the specified number of days
     */
    cleanupOldContent(): Promise<{
        deleted: string[];
        kept: string[];
        errors: string[];
    }>;
    /**
     * Extract date from filename (assumes format: YYYY-MM-DD.json)
     */
    private extractDateFromFilename;
    /**
     * Get content statistics
     */
    getContentStats(): Promise<{
        totalFiles: number;
        oldestDate: string | null;
        newestDate: string | null;
        filesToDelete: number;
    }>;
}
/**
 * Standalone function to clean up content
 */
export declare function cleanupContent(options?: ContentCleanupOptions): Promise<void>;
/**
 * CLI function for manual cleanup
 */
export declare function runContentCleanup(): Promise<void>;
//# sourceMappingURL=contentCleanup.d.ts.map