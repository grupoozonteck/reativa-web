export interface CommissionItem {
    id?: number;
    order_id?: number;
    attendant_name?: string;
    customer_name?: string;
    description_extra?: string;
    order_value?: number | string;
    value?: number | string;
    status?: string;
    created_at?: string;
    personal_order?: {
        user?: {
            login?: string;
            name?: string;
        };
        value?: number | string;
        customer_reengagement?: {
            attendant?: {
                user?: {
                    login?: string;
                    name?: string;
                };
            };
        };
    };
}
