# Climate Change Interactive Data Dashboard

Stream Two Project: Interactive Frontend Development - Code Institute
 
## UX
The purpose of this data dashboard is raise awareness amongst the general public about climate change via the use of datasets and graphs that clearly demonstrate the negative effects of climate change on our planet, as well as to provide datasets and graphs that will show the user what the most effective ways to combat the negative effects of climate change on both as an individual, and on a societal and global scale.

The emotive images used in the jumbotron and page divider of the dashboard are intended to catch the user's attention evoke an emotional response from the user in order to increase the likelihood that they will take more of the information contained in the dashboard to heart.

The first four graphs within the dashboard are intended to provide the user with a clear picture of exactly what climate change entails, such as rising sea levels and increased atmospheric co2 concentration. These graphs are intended to invoke concern over climate change in the user so that they may be more inclined to find out ways to combat he effects of climate change. The second set of graphs is designed to give the usere some hope that positivge chages can be made to help combat climate change, and provide insight into what these changes may be.

A live desktop demo can be found [here](https://sianjade.github.io/climate-change-data-dashboard/).

## User stories
### User story 1:
As a school science teacher, I would like to access datasets and charts that allow me to show my students the causes and effects of climate change so that my students can gain a better understanding of issues that have a direct impact on our future as a society.

### User story 2:
As somebody who is looking to become more environmentally friendly, I would like to find out what causes climate change and ways to reduce the the effects of it, so that I can implement relevant and effective changes to my own lifestyle to help combat climate change.

### User story 3:
As a data analyst, I would like to be able to view relevant datasets relating to climate change all in one places in order to be able to look for correlations between these different datasets.

### User story 4:
As an environmental studies student at university I would like to be able to view the original datasets in order to cite them in my thesis paper.

### User story 5:
As a potential energy investor, I would like to be able to view global trends in the renewable energy sector so that I can decide which energy types are most suitable for me to invest in.

## Features

### Existing Features

- The dashboard features a Javascript countdown timer which is counting down to 11 years from the publication date of the UN report cited in the page's jumbotron; this feature is designed to give the reader a sense of how little time is left for measures against the impacts of climate change to be implemented, it is designed to provide a sense of urgency to the user.

- Below each graph I have added extra contextual information to help users fully understand what the graph is showing, as well as how this impacts climate change and what the consequences may be. Aside from providing extra context for the graphs, I also felt that this was necessary in order to invoke an emotional reaction in the user so that after viewing the data, they may be more likely to enact changes in their lives which may have a positive effect on the environment and climate change.

- In order to make the dashboard more compact and take up less unnecessary vertical space on the user's device, a see more button has been added to the information below each graph so that user's can decide whether or not they wish to see more contextual information about each particular graph. This feature is particularly useful on mobile devices where screen space is much more limited, however I decided to implement this feature across all device sizes in order to avoid the potential for information overload.

- On mobile devices, a horizontal scroll has been applied to all divs which contain graphs as dc.js graphs are not responsive, and would be very difficult to read if their width was reduced to fit the smaller screen size. The rest of the dashboard is responsive, and adding this horizontal scroll to the graph divs only ensures that the whole page does not scroll sideways on swiping the screen.

- DC line charts are included to show global average temperature rise as well as global average sea level rise. When hovering the mouse over an item in the chart's legend, the corresponding line on the graph will be highlighted and the other lines will fade until the mouse is removed from hovering over that particular legend item.

- DC bubble chart with the bubble's x co-ordinate showing each country's maximum recorded annual co2 emissions, the y co-ordinate showing their minimum recorded annual co2 emissions, and the radius of the bubble representing the country's average annual share of co2 emissions. When hovering the mouse over a particular bubble, a tooltip will appear containing the country's exact maximum emissions figure and their exact average emissions figure.

- DC bar chart showing the increase in atmospheric co2 concentration each year - the exact figure for any given year will be shown in a tooltip upon hovering the mouse over a particular bar.

- Composite DC scatter plot showing new planting figures for conifers and broadleaves in UK forests by country, as well as restocking figures for conifers and broadleaves in UK forests by country.

- Stacked DC bar chart showing worldwide renewable energy production by type and its increase each year. Upon hovering over a slice in the a stacked bar, a tooltip will appear displaying the precise number of GWh for that particular energy type in that particular year.

- Stacked DC line chart showing the increase in renewable enegry production each year by continent.

- DC pie chart showing ways to reduce carbon footprint and how many tonnes of co2 emissions each change would save per person per year.

- All links to external websites use the `target='blank'` attribute in order to ensure that they open in a new tab when clicked, rather than in the current tab and taking the user off of the dashboard page. This eleminates the need for the use of the browser's back and forward buttons.


### Features Left to Implement

- In future versions of the website, I would like to implement world maps using TopoGeo.JSON and d3.js in order to show relevant climate change data, fossil fuel consumption, and renewable enegry data for each individual country as the user hovers over it with their mouse.

- I would also like to add a news aggregator widget to the dashboard that shows recent relevant news articles regarding climate change and renewable energy.

## Technologies Used

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
    - The project uses HTML5 to construct the webpage and layout for the dashboard itself.

- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3)
    - The project uses CSS3 in order to style the HTML5 and Bootstrap elements and components.

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    - The project uses JavaScript to add interactivity to the dashboard and to retrieve certain data from CSV files for graphs and charts.

- [Bootstrap (ver 4.3.1)](https://getbootstrap.com/)
    - The project uses the Bootstrap 4 grid and components in order to achieve a responsive layout, as well as Bootswatch theme Darkly for the colour scheme.

- [crossfilter.js (v 1.3.12)](https://square.github.io/crossfilter/)
    - The project uses the Crossfilter.js library in order to create dimensions and groups from the datasets that could then be used to build charts using DC.js.

- [dc.js (v 2.1.8)](https://dc-js.github.io/dc.js/)
    - The project uses the DC.js library in order to build graphs and charts from the prebuilt chart types included in the library.

- [d3.js (v 3.5.17)](https://d3js.org/)
    - The project uses D3.js order to style the prebuilt charts included in DC.js

- [queue.js (v 1.0.7)](https://www.npmjs.com/package/queue)
    - The project uses Queue.js in order to bind to the external datasets in the Data folder, as well as to defer the rendering of the charts until all of the required datasets are fully imported.

## Testing

- HTML code has been run through the [W3C Markup Validator](https://validator.w3.org/) and corrected accordingly. Only one waring has not been addressed, that being "Section lacks heading. Consider using h2-h6 elements to add identifying headings to all sections." However each section contains multiple articles each with their own clearly defined heading, as such I did not add headings to the two sections.

- CSS code has been validated via the [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) and returned no errors.

- Initially the countdown timer was only divided into days, hours, minutes, and seconds, however because the countdown's end date is 11 years into the future, the remaining day count was over 3000. In order to combat this I had to calculate the average number of days in a month (because there are not an equal number of days eveery month) and use this number to calculate the number of months and years remaining in the countdown.

- To test that the dashboard was fully responsive across all device sizes and that all media queries for various device sizes were working correctly, I ran the dashboard in Firefox's developer tools responsive design mode, as well as on an iPhone on all available browser types on the Apple Store, all available broswers on an Amazon Kindle tablet, and all available broswers on android smartphones.

- The buttons in the jumbotron and page divider have been manually tested to ensure they smoothly scroll to the specified id upon clicking each button.

- All links have been manually tested to ensure that `target='blank'` works correctly and all external links open in a new tab upon clicking.

- At present, none of the data points in the UK forest maintenance graph are rendering on the chart. I have tried making the scatter plot into a composite scatter plot to combat this, however this did not work. I also tried making the x axis scale ordinal rather than linear, however this did not remedy the situation either. In future releases I will attempt to find a way to get the relevant data points to render on the graph.

- Currently the `see more` buttons beneath each graph do not show text on page load, and they require two clicks in order for the information to be displayed, however from this point on they do work as intended and show more/less text on click. At present I have not determined what exactly is causing this issue, although in future releases I will look to remedy this issue.

- At present, there are overlapping bubbles for over 200 countries in the annual share of co2 emissions bubble chart, in future releases I will look to only display the top 20 co2 emitting countries on page load, and implement a dropdown menu for the user to be able to select other countries to view outside of this default range.

## Deployment
- The dashbaord is hosted via GitHub Pages and is deployed from the master branch - this is to allow the deployed dashboard to automatically update with any new commits that are made to the master branch.

    - To deploy the dashboard to GitHub Pages, I first clicked the settings tab on the GitHub repository for the site.
    - From here, I scrolled to the GitHub Pages section of the setting tab and changed the Source from 'none' to 'master branch'.
    - This deployed the dashboard to GitHub Pages and provided me with a link to the hosted page, which I then copied and pasted into the decription of the repository.
    
- To run this application locally:
    - Click the green 'clone or download' button in the [GitHub repository for the project](https://github.com/SianJade/climate-change-data-dashboard).
    - Copy the link provided by clicking the clipboard button to the right of the link.
    - In your terminal, type `git clone`, paste in the previously copied link, and hit return.
    - The application should now be installed on your device.

## Credits

### Content

- The smooth scrolling effect used for the jumbotron and page divider buttons can be found on [Stack Overflow](https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link).

- Datasets for annual share of co2 emissions, global sea level rise, global temperature rise, and global co2 concentration graphs can be found at [ourworldindata.org](https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions).

- Datasets for renewable energy by type and renewable energy by continent graphs can be found at [irena.org](https://www.irena.org/).

- Information accompanying atmospheric co2 concentration chart was found on [Sciencing.com](https://sciencing.com/list-5921485-effects-carbon-dioxide-air-pollution.html).

- Information accompanying annual share of co2 emissions chart can be found at [science.howstuffworks.com](https://science.howstuffworks.com/environmental/green-science/human-activities-increase-carbon-dioxide.htm).

- Information accompanying renewable energy production by type and renewable energy by continent charts can be found at [uscusa.org](https://www.ucsusa.org/clean-energy/renewable-energy/public-benefits-of-renewable-power).

- Information accompanying forest maintenance graph can be found at [eartheclipse.com](https://www.eartheclipse.com/environment/advantages-and-importance-of-reforestation.html).

- Information accompanying the pie chart showing ways to reduce your carbon footprint can be found at [independent.co.uk](https://www.independent.co.uk/environment/children-carbon-footprint-climate-change-damage-having-kids-research-a7837961.html).

### Media

- The image used in the dashboard's jumbotron can be found at [medium.com](https://medium.com/@globalmillenial/greenlands-ice-sheet-is-melting-8e946fb3e565).

- The image used in the page divider can be found at [worldatlas.com](https://www.worldatlas.com/articles/worst-countries-for-deforestation-by-woodland-area-losses.html).

