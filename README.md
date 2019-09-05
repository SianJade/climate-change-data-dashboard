# Climate Change Interactive Data Dashboard

Stream Two Project: Interactive Frontend Development - Code Institute
 
 
## UX
The purpose of this data dashboard is raise awareness amongst the general public about climate change via the use of datasets and graphs that clearly demonstrate the negative effects of climate change on our planet, as well as to provide datasets and graphs that will show the user what the most effective ways to combat the negative effects of climate change on both as an individual, and on a societal and global scale.

A live desktop demo can be found [here](https://sianjade.github.io/climate-change-data-dashboard/).

## User stories
### User story 1:
As a school science teacher, I would like to access datasets and charts that allow me to show my students the causes and effects of climate change so that -----

### User story 2:
As somebody who is looking to become more environmentally friendly, I would like to find out what causes climate change and ways to reduce the the effects of it, so that I can implement relevant and effective changes to my own lifestyle to help combat climate change.

### User story 3:
As a data analyst, I would like to be able to view relevant datasets relating to climate change all in one places in order to be able to look for correlations between these different datasets.

## Features

### Existing Features

- The dashboard features a Javascript countdown timer which is counting down to 11 years from the publication date of the UN report cited in the page's jumbotron; this feature is designed to give the reader a sense of how little time is left for measures against the impacts of climate change to be implemented, it is designed to provide a sense of urgency to the user.

- In order to make the dashboard more compact and take up less unnecessary vertical space on the user's device, a see more button has been added to the information below each graph so that user's can decide whether or not they wish to see more contextual information about each particular graph. This feature is particularly useful on mobile devices where screen space is much more limited, however I decided to implement this feature across all device sizes in order to avoid the potential for information overload.

- Below each graph I have added extra contextual information to help users fully understand what the graph is showing, as well as how this impacts climate change and what the consequences may be. Aside from providing extra context for the graphs, I also felt that this was necessary in order to invoke an emotional reaction in the user so that after viewing the data, they may be more likely to enact changes in their lives which may have a positive effect on the environment and climate change.


### Features Left to Implement

- In future versions of the website, I would like to implement world maps using TopoGeo.JSON and d3.js inorder to show relevant climate change data, fossil fuel consumption, and renewable enegry data for each individual country as the user hovers over it with their mouse.

- I would also like to add a news aggregator widget to the dashboard that shows recent relevant news articles regarding climate change and renewable energy.

## Technologies Used

- [HTML5](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
    - The project uses HTML5 to construct the webpage for the dashboard itself.

- [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3)
    - The project uses CSS3 in order to style the HTML5 and Bootstrap elements and components.

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
    - The project uses JavaScript to add interactivity to the dashboard and to retrieve certain data from CSV files for graphs and charts.

- [Bootstrap (ver 4.3.1)](https://getbootstrap.com/)
    - The project uses the Bootstrap 4 grid and components in order to achieve a responsive layout.

- [dc.js (v 2.1.8)](https://dc-js.github.io/dc.js/)

- [d3.js (v 3.5.17)](https://d3js.org/)

- [crossfilter.js (v 1.3.12)](https://square.github.io/crossfilter/)

- [queue.js (v 1.0.7)](https://www.npmjs.com/package/queue)


## Testing


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


### Media


### Acknowledgements

