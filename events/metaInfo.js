//emit event when there is an attempt to logIn
//emit event on the response

/*
<<--------------------------------------->>
  create a school
  get all schools
  get one school
  update a school
  delete a school
<<--------------------------------------->>


<<--------------------------------------->>
  create a team
    + add team to school
    + add team to coach

  get all teams
  get one team

  update a team
    -> edit name/gender/createdBy
        + [athletes, athmetrics, coaches, groups, metric category, metrics, schools]
    -> add coach
        + [coaches]
          - if team already has athletes following, then new coach needs to be added to athletes
            + [athletes, athmetrics]
    -> remove coach
        + [athletes, athmetrics, coaches]
    -> add athlete
        - An athlete is created within the TEAM scope
          + [athlete, coaches, schools]
    -> remove athlete
        + []
    -> add metric category
        + [metric category, metrics]
    -> remove metric category
        + [metric category, metrics]
    -> add metrics
        + [metrics]
    -> remove metrics
        + [metrics]
    -> add groups
        + [athletes, athmetrics, coaches, groups, metric category, metrics]
    -> remove groups
        + [athletes, athmetrics, coaches, groups, metric category, metrics]

  delete a team
    + [athletes, athmetrics, coaches, groups, metric category, metrics, schools]
<<--------------------------------------->>


<<--------------------------------------->>
  create an athlete
  get all athletes
  get one athlete
  update an athlete
  delete an athlete
<<--------------------------------------->>


<<--------------------------------------->>
  create an athlete
  get all metric categories
  get one metric category
  update an athlete
  delete an athlete
<<--------------------------------------->>


<<--------------------------------------->>
  create a metric
  get all metrics
  get one metric
  update a metric
  delete a metric
<<--------------------------------------->>
 */