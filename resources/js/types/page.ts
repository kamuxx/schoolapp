export interface Page {
    current_page: number;
    limit: number;
    offset: number;
    last_page: number;
}


export interface PayloadSearch {
    search?: string | object | null | undefined;
    page: number ;
    per_page: number;
}