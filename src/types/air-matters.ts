export interface AirQualityResponse {
    latest: {
        readings: AirQualityReading[];
        update_time: string;
    };
}

export interface AirQualityReading {
    name: string;
    kind: string;
    color: string;
    level: string;
    value: string;
    unit?: string;
    ratio: number;
    type: 'index' | 'pollutant';
}

export type AirQualityLevel = '优' | '良好' | '中等' | '对敏感人群不健康' | '不健康' | '非常不健康' | '危险';