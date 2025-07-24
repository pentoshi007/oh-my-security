import { type AttackType } from './types.js';
/**
 * Get date in YYYY-MM-DD format
 */
export declare function getCurrentDate(): string;
/**
 * Detect attack type from article title and description using keyword matching
 */
export declare function detectAttackType(title: string, description?: string): AttackType;
/**
 * Clean and validate file path
 */
export declare function getContentFilePath(date: string): string;
/**
 * Format date for display
 */
export declare function formatDisplayDate(dateStr: string): string;
//# sourceMappingURL=utils.d.ts.map