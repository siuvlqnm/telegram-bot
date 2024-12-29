export interface AccuWeatherLocation {
  Key: string;
  LocalizedName: string;
  Country: {
    LocalizedName: string;
  };
  AdministrativeArea: {
    LocalizedName: string;
  };
}

export interface AccuWeatherCurrentConditions {
  LocalObservationDateTime: string;
  WeatherText: string;
  WeatherIcon: number;
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
    };
  };
  RelativeHumidity: number;
  Wind: {
    Speed: {
      Metric: {
        Value: number;
        Unit: string;
      };
    };
    Direction: {
      Degrees: number;
      Localized: string;
    };
  };
  UVIndex: number;
  UVIndexText: string;
}

export interface AccuWeatherForecast {
  Headline: {
    Text: string;
  };
  DailyForecasts: Array<{
    Date: string;
    Temperature: {
      Minimum: {
        Value: number;
        Unit: string;
      };
      Maximum: {
        Value: number;
        Unit: string;
      };
    };
    Day: {
      IconPhrase: string;
    };
    Night: {
      IconPhrase: string;
    };
  }>;
}