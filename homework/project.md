---
sidebar_position: 0
homework_number: 0
hide_table_of_contents: true
title: Course Project
---

The Course Project will be split into multiple assignments, spread throughout
the course. In order to more easily understand its full scope, this page
includes all parts of it.


You’ve been recruited to work in the research wing working to help pass
legislation modelled after an act that is currently under discussion in RI, the
Create Homes Act.  

There are two components of the Act that you will work on research projects
related to (these descriptions come from from
https://reclaimri.org/campaign/housing-justice-legislation):

1. Creating a land bank to recapture and develop housing on underutilized public property.
2. Funding the acquisition, preservation, and renovation of existing multi-family housing.

Tasks related to each component: 

1. You will identify existing public property that is unused or underutilized using public tax records. Once it has been identified, you will visualize where it is, and compute metrics of desirability for development — distance to public transit, to schools, etc. 
2. You will identify existing inventory of multi-family housing, again using the public tax records. These record should be used to determine priority buildings: ones with a low tax value to square footage ratio, which may indicate poor condition but also mean less expensive to acquire, and again use desirability metrics, and visualize the results.

In order to do this we need:
- data that indicates publicly owned property and what it is used for / value of buildings.  Building type “99 - Vacant” and “LU_DESC” “CITY OF BOSTON”? Not sure if that’s everything but maybe enough?
- data with locations of public transit, schools, anything else “desirable” (parks? libraries?). Tax assessors has a “GIS ID” — not sure how to use that. 
- data with multi-family houses, unit sizes and tax values (to be able to compute value per unit). Tax assessors DB gives living area and total value 
