# Coop Solution Outline
====

### Overview: 

My solution to the Coop scenario parses the transactions.xml logs and creates a transactions collection and a members collection in Mongo:

`node lib/restore-db`

Then two further scripts infer ratings for each member of the coop based on their transactions (the more frequently a member uses a provider, the higher that provider is rated), and generate recommendations based on ratings of members who had similar transaction records.  Ratings are cast into a 5-point scale, anticipating a future web-app ui.

`node lib/generate-ratings`
`node lib/generate-recs`

The recommendation engine employs a version of the [Slope One](http://en.wikipedia.org/wiki/Slope_One) collaborative filtering algorithm. 

The Angular application presents the the results of the recommendation engine with some additional sorting features.

### Stack:

- Node
- Express
- Mongo with Mongoose
- Angular

### Testing:
- Mocha for REST API
- Karma for Angular

### Automation:
- Grunt



