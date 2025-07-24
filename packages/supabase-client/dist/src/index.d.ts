export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export interface DailyContent {
    id: number;
    date: string;
    attack_type: string;
    content_data: {
        attackType: string;
        date: string;
        metadata: {
            attackId: string;
            difficulty: string;
            category: string;
            industry: string[];
            timeline: string;
            impact: string;
            detection: string;
            mitigation: string;
        };
        blueTeam: {
            overview: string;
            detection: string[];
            response: string[];
            prevention: string[];
            tools: string[];
        };
        redTeam: {
            overview: string;
            attack_steps: string[];
            tools: string[];
            evasion: string[];
            payload_examples: string[];
        };
        news: Array<{
            title: string;
            description: string;
            url: string;
            publishedAt: string;
            source: string;
        }>;
    };
    created_at: string;
}
export declare function storeContentInSupabase(content: any): Promise<void>;
export declare function getContentByDate(date: string): Promise<DailyContent | null>;
export declare function getAllContent(limit?: number): Promise<DailyContent[]>;
export declare function getContentArchive(): Promise<{
    date: string;
    attack_type: string;
}[]>;
