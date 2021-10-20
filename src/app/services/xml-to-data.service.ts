import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class XmlToDataService {
  public data: Array<any> = [];

  public parseXmlToData(response: string) {
    const xml_document = new window.DOMParser().parseFromString(response, "text/xml")
    const data_valutes: Element[] = Object.values(xml_document.getElementsByTagName('Valute'))

    data_valutes.forEach((valute: Element, index) => {
      if (!this.data[index]) {
        this.data[index] = {};
      }
      valute.getAttributeNames().forEach(attr_name => {
        Object.assign(
          this.data[index],
          {
            [attr_name]: valute.getAttribute(attr_name)
          }
        )
      })
      valute.childNodes.forEach((child) => {
        Object.assign(
          this.data[index],
          {
            [child.nodeName]: child.textContent
          }
        )
      })
    })

    return this.data;
  }
}
