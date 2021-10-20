import { Injectable } from '@angular/core';
import { XmlToDataService } from './xml-to-data.service';

export enum TypeResponse {
  JSON ,
  TEXT,
}

export const INTERVAL_REQUEST = 10000;

interface ISource {
  url: string;
  type: TypeResponse;
}

const SOURCES: ISource[] = [
  { url: 'https://www.cbr-xml-daily.ru/daily_json.js', type: TypeResponse.JSON },
  { url: 'https://www.cbr-xml-daiy.ru/daily_utf8.xml', type: TypeResponse.TEXT }
]

@Injectable({
  providedIn: 'root',
})
export class DataRequestService {
  public current_source: ISource = SOURCES[0];
  public current_type_response: TypeResponse | undefined;
  public update_time: Date = new Date(Date.now());

  constructor(private xml_to_data_service: XmlToDataService) {
  }

  public async getDataOnSource(source_number: number): Promise<any | void> {
    let response: any;
    let data: any;

    response = await fetch(SOURCES[source_number].url)
      .then((resp): Promise<any> => {
        if (SOURCES[source_number].type === TypeResponse.JSON) {
          this.current_type_response = TypeResponse.JSON;
          return resp.json();
        }
        if (SOURCES[source_number].type === TypeResponse.TEXT) {
          this.current_type_response = TypeResponse.TEXT;
          return resp.text();
        } else {
          throw Error('Unknown type response')
        }
      })
      .catch((error) => {
        console.error('Source connection error:', error);
        this.update_time = new Date(Date.now());
      });


    if (!response) {
      this.current_source = SOURCES[++source_number];
      if (source_number < SOURCES.length) {
        return await this.getDataOnSource(source_number);
      }
    } else {

      switch (this.current_type_response) {
        case TypeResponse.JSON:
          data = Object.values(response.Valute);
          break;
        case TypeResponse.TEXT:
          data = this.xml_to_data_service.parseXmlToData(response);
          break;
      }

      this.update_time = new Date(Date.now());
      return data;
    }
  }
}
