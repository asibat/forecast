# forecast

This project was developed with Node.js, Koa2, React using rapidApi weather forecast.
Add your rapidApid host and key using ENV VARIABLE:

- X_RAPID_API_KEY
- X_RAPID_API_HOST


The application recieves a csv file containing a list of cities and temperature conditions
  
| City  | Condition |
| ------------- | :-------------: |
| Madrid, ES  | >1 |
| Rome, IT  | =15 |
| Santiago de Cali, CO | <2 |
 
The app gives you the ability to upload a file OR use the api to process and parse the file.

The app will activate an alert status if the current temperature of the city fulfils or violates the condition, the UI will render this table of results:



| City  | Current Temp | Condition | Last Triggered | Status |
| ------------- | :-------------: |  :-------------: |  :-------------: |  :-------------: |
| Madrid, ES  | 15 | >1  | 22/10/2020, 15:40 | ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=●) |
| Rome, IT  | 2 |  =15  | - | ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=●) |


cities' temperature will be updated every minute and render the new results.
