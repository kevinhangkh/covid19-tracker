import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DateWiseDataSummary } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private globalDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
  private dateWiseDataUrl = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv';
  private local_dateWiseDataUrl = '../assets/time_series_covid19_recovered_global.csv';

  constructor(private http: HttpClient) {
    
    this.globalDataUrl += this.getYesterdaysDate() + ".csv";
    console.log(this.globalDataUrl);
    
  }

  getYesterdaysDate(): string {
    var today = new Date();
    today.setDate(today.getDate() - 1); //yesterday's file because today's likely not to be available yet

    var options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    
    var date: string = today.toLocaleDateString('en-US', options).replace(/\//g, "-");
    console.log(date);

    return date;
  }
   
   getGlobalData() {
    return this.http.get(this.globalDataUrl, {responseType: "text"}).pipe(
      map(
        (result) => {

          //Array of Object key: country; value: GlobalDataSummary
          let raw = {};
          //Get the rows by splitting every \n
          let rows = result.split("\n");
          //Removing the first row (header)
          rows.splice(0,1);

          rows.forEach(row => {
            //Splitting at every comma encountered except the ones with a following whitespace
            let cols = row.split(/,(?=\S)/);
            
            //Get the columns of interest
            let cs = {
              country: cols[3],
              confirmed: +cols[7],
              deaths : +cols[8],
              recovered : +cols[9],
              active : +cols[10]
            };

            let temp: GlobalDataSummary = raw[cs.country];
            //If a key-value of a country exists then we add the numbers
            if (temp) {
              temp.confirmed += cs.confirmed;
              temp.deaths += cs.deaths;
              temp.recovered += cs.recovered;
              temp.active += cs.active;

              raw[cs.country] = temp;
            }
            //Else create a key-value
            else {
              raw[cs.country] = cs;
            }
          });

          // console.log(raw);

          //Return only the values of raw ie: the GlobalDataSummary objects
          //Type casting to array of GlobalDataSummary
          return <GlobalDataSummary[]>Object.values(raw);
        }
      )
      );
    }

    getDateWiseData() {

      return this.http.get(this.dateWiseDataUrl, {responseType: 'text'}).pipe(
        map(
          result => {
            
            let rows: string[] = [];
            rows = result.split('\n');
            // console.log(rows);

            //Get the header which contains the dates and useless stuff
            let header = rows[0];
            let dates = header.split(/,(?=\S)/);
            //Then get rid of the first columns (useless stuff)
            dates.splice(0,4);
            // console.log(dates);

            //Get rid of 1st row (the header)
            rows.splice(0,1);

            //Array of objects
            let data = [];

            rows.forEach(row => {
              let cols = row.split(/,(?=\S)/);
              // cols.push(row.split(','));
              // console.log(cols);
              
              //Get the country
              let cnt = cols[1];
              cols.splice(0,4);

              // console.log(cnt,cols);
              data[cnt] = [];
              cols.forEach((values, index) => {
                let dw: DateWiseDataSummary = {
                  country: cnt,
                  cases: +values,
                  date: new Date(Date.parse(dates[index]))
                };
                data[cnt].push(dw);
              });
              
            });

            // console.log(data);
            return data;
            

          }
        )
      );
    }

  }
