var mid = require('../middleware').middle
  , gbl = require('../middleware').globals
  , controllers = require('../controllers')
  , user = controllers.User
  , athlete = controllers.Athlete
  , metrics = controllers.Metrics
  , teams = controllers.Teams
  , fs = require('fs');

module.exports = function(app) {

  // Home
  app.get('/', function(req, res) {
    res.redirect('/teams'); // should redirect to login
  });

  // Login
  app.get('/login', mid.checkCookie, mid.checkSession, mid.redirect);
  app.post('/login', mid.validate, mid.authenticate, mid.setSession, user.dashboard);

  // Logout
  app.get('/logout', mid.checkCookie, mid.checkSession, user.logout);

  // Teams Page
  app.get('/teams', function(req, res, next) {
    res.render('teams', {
      // nav: teamsPage.apeLibrary.school
      teamsPage: teamsPage
    });
  });

  // POST create team
  app.post('/teams', function(req, res, next) {
    var name = req.body.name;
    var gender = req.body.gender;
    
    // Reference to the displayImage object
    var displayImage = req.files.displayImage;

    // Temporary location of the uploaded file
    var tmp_path = displayImage.path;

    // New location of the file
    var target_path = './public/uploads/' + displayImage.name;

    // Move the file from the new location
    // fs.rename() will create the necessary directory
    fs.rename(tmp_path, target_path, function(err) {
      // If an error is encountered, pass it to the next handler
      if (err) { next(err); }
      // Delete the temporary file
      fs.unlink(tmp_path, function() {
        // If an error is encountered, pass it to the next handler
        if (err) { next(err); }
        console.log('File uploaded to: ' + target_path + ' - ' + displayImage.size + ' bytes');
        res.redirect('/teams');
      });
    });
  }); // /app.post

  // Teams Page
  app.get('/roster', function(req, res, next) {
    res.render('roster');
  });

};


/*
  JSON Package for the Teams Page
*/
var teamsPage = {
        "apeLibrary": {
          "school": {
            "SCHID": "7ac6a85a-4b06-4bfd-bbfd-729ac5b9dbe3",
            "name": "{{ \"[object Object]\" tag is not supported }}"
          },
          "coach": {
            "COID": "4db2d151-44f5-49ef-9129-164ac0ee556c",
            "name": "Harrison Walter"
          },
          "metricCat": [
            {
              "MTRCATID": "eb7ba330-7bb0-411f-bd24-cfea6d256060",
              "name": "consectetur",
              "metrics": [
                {
                  "MID": "2db4d85b-e605-4b53-a96a-b26c98350170",
                  "name": "minim"
                }
              ]
            },
            {
              "MTRCATID": "72d29d59-fabe-4d4f-946f-8ee979241355",
              "name": "dolor",
              "metrics": [
                {
                  "MID": "38afb48a-7a1b-4ae8-813b-fd0df98cae08",
                  "name": "ut"
                }
              ]
            },
            {
              "MTRCATID": "029554ca-74d3-4c9e-8025-ca80c636bebc",
              "name": "duis",
              "metrics": [
                {
                  "MID": "02ce728b-c067-43f3-ab85-40e333d7c9f6",
                  "name": "sit"
                }
              ]
            }
          ],
          "metrics": [
            {
              "MID": "154b1a49-eb1a-464d-aace-aabcda440608",
              "name": "elit"
            }
          ],
          "teams": [
            {
              "TMID": "170c80ff-bf0e-4591-8473-ca739160917a",
              "name": "Football",
              "gender": "male",
              "image": "/public/uploads/IMG_0502.jpg",
              "metricCat": [
                {
                  "MTRCATID": "7329d366-3dc5-4b69-bf04-2cdc73c4bcce",
                  "name": "consequat",
                  "metrics": [
                    {
                      "MID": "0ccad0da-d11a-4f41-933b-2f4302e100d0",
                      "name": "excepteur"
                    },
                    {
                      "MID": "a3250718-a3ca-4be9-87cf-9ef55719241b",
                      "name": "commodo"
                    },
                    {
                      "MID": "aeb0231a-7aed-4290-bc35-bcabf3fea2fc",
                      "name": "anim"
                    },
                    {
                      "MID": "53d1429d-157e-40e3-95b2-bcaee52b6d33",
                      "name": "id"
                    }
                  ]
                },
                {
                  "MTRCATID": "e3faa10b-73dd-47d3-b403-80f99b797c20",
                  "name": "non",
                  "metrics": [
                    {
                      "MID": "450be5bf-16ba-4111-aa76-00d9beb5070f",
                      "name": "laboris"
                    },
                    {
                      "MID": "ecc57243-ee51-4eef-ba11-305b2dd53958",
                      "name": "sit"
                    },
                    {
                      "MID": "96203e4e-a6fa-45f0-a1e7-0e9421ee7634",
                      "name": "tempor"
                    },
                    {
                      "MID": "9df7191e-cc9e-4e84-922b-0fd44d45804b",
                      "name": "ipsum"
                    }
                  ]
                },
                {
                  "MTRCATID": "fe7ac116-5eb1-4dc0-b596-9918ca3b89ee",
                  "name": "esse",
                  "metrics": [
                    {
                      "MID": "4d0d9f26-d0cc-4eb0-ab45-1498d4b9a436",
                      "name": "commodo"
                    },
                    {
                      "MID": "4be65d01-0f40-4c08-b9a8-ee3df63096e0",
                      "name": "in"
                    },
                    {
                      "MID": "5d6331b8-7ad9-472e-ad66-b544586f64a2",
                      "name": "ut"
                    },
                    {
                      "MID": "4d4bfd1e-77d6-40b3-a485-1d75ad2eedd9",
                      "name": "ullamco"
                    }
                  ]
                }
              ],
              "metrics": [
                {
                  "MID": "97451db6-ffbb-4655-8b49-ac1768e6de1c",
                  "name": "est"
                },
                {
                  "MID": "b41bcf33-987a-4c81-96ed-80a2ea17c590",
                  "name": "ex"
                },
                {
                  "MID": "db898c8d-8c4d-4dcb-8f1f-7379c3daeb03",
                  "name": "dolor"
                },
                {
                  "MID": "6aca7996-4b7a-4b29-8243-c1b4434d1287",
                  "name": "esse"
                },
                {
                  "MID": "9b2ea249-0d78-4dc4-8480-bcc7bf8a9648",
                  "name": "ad"
                }
              ]
            },
            {
              "TMID": "52b1ca9a-c5d5-40c9-8702-2a7ae64060ac",
              "name": "Volleyball",
              "gender": "female",
              "image": "duis.jpg",
              "metricCat": [
                {
                  "MTRCATID": "5c6f8da7-e332-4c32-a1a4-64343d143501",
                  "name": "esse",
                  "metrics": [
                    {
                      "MID": "5f503bc5-aca9-4e50-acbe-492daa317365",
                      "name": "amet"
                    },
                    {
                      "MID": "613c8b7a-46d7-4ba6-b519-acbbf01fbc33",
                      "name": "occaecat"
                    },
                    {
                      "MID": "cd6c8b19-3a19-4293-b968-9f87c891a894",
                      "name": "do"
                    },
                    {
                      "MID": "ed2fc157-b1a2-48c5-a811-2627498831c9",
                      "name": "nisi"
                    }
                  ]
                },
                {
                  "MTRCATID": "d5a289d1-5cd2-41b2-9831-5ea8aa899d51",
                  "name": "nulla",
                  "metrics": [
                    {
                      "MID": "58028fa8-483a-4cc6-84e3-f83bfa9f29d1",
                      "name": "qui"
                    },
                    {
                      "MID": "7af8ca80-c91b-4e70-87a6-2a8a427cdd7f",
                      "name": "occaecat"
                    },
                    {
                      "MID": "0e77a41f-e091-4bef-b55e-6449e49fdfaf",
                      "name": "nostrud"
                    },
                    {
                      "MID": "4fc03738-fd6b-4553-bdd4-0618d00f2ca7",
                      "name": "deserunt"
                    }
                  ]
                },
                {
                  "MTRCATID": "39b30a06-500c-4e6f-99cd-5b36bf0cf5e9",
                  "name": "ipsum",
                  "metrics": [
                    {
                      "MID": "d7dfe197-44bf-4436-8961-cd60b42cc159",
                      "name": "elit"
                    },
                    {
                      "MID": "a69ed9a1-f5dd-43c9-ba0a-c39d259bffc0",
                      "name": "exercitation"
                    },
                    {
                      "MID": "b8f8dc8a-1116-4bc3-8b89-dfae99d9f10f",
                      "name": "aute"
                    },
                    {
                      "MID": "83e7f870-5dd6-41a2-bbc5-6698e247cbb5",
                      "name": "cupidatat"
                    }
                  ]
                }
              ],
              "metrics": [
                {
                  "MID": "6aa4b529-8984-4760-941a-615b507bcfea",
                  "name": "tempor"
                },
                {
                  "MID": "12b2dc68-5caa-41be-a435-4111c044169c",
                  "name": "Lorem"
                },
                {
                  "MID": "b676d04f-4581-4d0a-8fb4-46112cba765a",
                  "name": "ut"
                },
                {
                  "MID": "a5a76c3f-acef-4e0b-a020-0ca5704441d1",
                  "name": "cupidatat"
                },
                {
                  "MID": "facc9893-374c-4976-9090-4ca4b187e5ae",
                  "name": "sint"
                }
              ]
            },
            {
              "TMID": "0309ab84-99b8-4adf-864e-bbaf1b0d605a",
              "name": "laboris",
              "gender": "male",
              "image": "eu.jpg",
              "metricCat": [
                {
                  "MTRCATID": "6c09eef4-1e79-416b-9b2a-923c04f3d013",
                  "name": "occaecat",
                  "metrics": [
                    {
                      "MID": "85b9072f-99f7-4a2f-8ec2-6348de94a822",
                      "name": "eiusmod"
                    },
                    {
                      "MID": "f1320887-0deb-4518-aedf-70fd1a35ed20",
                      "name": "fugiat"
                    },
                    {
                      "MID": "26fefafd-62d5-44f5-8347-93e2e919e767",
                      "name": "labore"
                    },
                    {
                      "MID": "f87429b2-61f7-430b-88e2-4fb74d682885",
                      "name": "veniam"
                    }
                  ]
                },
                {
                  "MTRCATID": "6c9e2b26-010d-4ea9-92ec-f8f363bc7bee",
                  "name": "fugiat",
                  "metrics": [
                    {
                      "MID": "415723e4-b76e-4cae-8276-9161778dba5b",
                      "name": "quis"
                    },
                    {
                      "MID": "cda014b7-199e-4055-8877-fc4816444711",
                      "name": "laborum"
                    },
                    {
                      "MID": "37929b1e-fcf6-4d44-8dca-8ed3a97cccdb",
                      "name": "dolor"
                    },
                    {
                      "MID": "329d98d9-89cb-4925-9e4f-988d23117a77",
                      "name": "id"
                    }
                  ]
                },
                {
                  "MTRCATID": "4050a203-c553-4286-bc0f-b3e35d49be78",
                  "name": "reprehenderit",
                  "metrics": [
                    {
                      "MID": "1e7d7639-0034-40aa-af73-f3f8d448fd1e",
                      "name": "in"
                    },
                    {
                      "MID": "a6e335de-326a-4797-8012-17fc96818f69",
                      "name": "et"
                    },
                    {
                      "MID": "3f01ebe8-a3e6-4239-8240-853e1c3754c1",
                      "name": "ipsum"
                    },
                    {
                      "MID": "c96af4c8-e1f8-474e-8764-4726a091f69d",
                      "name": "magna"
                    }
                  ]
                }
              ],
              "metrics": [
                {
                  "MID": "b4a14b85-2ed7-43ea-8f4d-57d0a972d241",
                  "name": "sit"
                },
                {
                  "MID": "a5d5375a-2321-4fb0-8274-f88fe0dbfa45",
                  "name": "aliquip"
                },
                {
                  "MID": "5257321a-bff0-433d-9da3-5e9f9188a2a1",
                  "name": "tempor"
                },
                {
                  "MID": "a4192043-d40d-4946-9025-097356f5a9f0",
                  "name": "mollit"
                },
                {
                  "MID": "67ffaa5a-731c-4613-94b3-b68925cb40b9",
                  "name": "ut"
                }
              ]
            },
            {
              "TMID": "d546c1cc-8ae0-430a-a2d9-02f49e5a1701",
              "name": "pariatur",
              "gender": "male",
              "image": "irure.jpg",
              "metricCat": [
                {
                  "MTRCATID": "0fedf4cf-ed4e-438f-ad0f-77cb2ddc3d2f",
                  "name": "reprehenderit",
                  "metrics": [
                    {
                      "MID": "037e11c7-e4ed-4f86-8b74-4b7cc2b0dc5c",
                      "name": "dolore"
                    },
                    {
                      "MID": "ca483c8a-20c5-47ba-be87-f442fc4f2df8",
                      "name": "pariatur"
                    },
                    {
                      "MID": "b103f119-c017-44d5-b473-ab413deaad1f",
                      "name": "id"
                    },
                    {
                      "MID": "316a4239-e3cf-4050-9ae6-c0210a5e1c14",
                      "name": "exercitation"
                    }
                  ]
                },
                {
                  "MTRCATID": "ac56adab-ff95-4aeb-b47d-b37814065742",
                  "name": "sint",
                  "metrics": [
                    {
                      "MID": "85ac18ca-852a-4b36-bcea-050468be4861",
                      "name": "esse"
                    },
                    {
                      "MID": "bad1ff86-bb7f-4ae3-a349-843f105caa5c",
                      "name": "non"
                    },
                    {
                      "MID": "c25d9899-efa4-43e9-a692-1a0cdc01eed7",
                      "name": "Lorem"
                    },
                    {
                      "MID": "5e9b57af-baae-4caa-9a51-feeaab72e8a5",
                      "name": "ad"
                    }
                  ]
                },
                {
                  "MTRCATID": "a4429b3e-a3c0-473e-b4c2-79262a663f0a",
                  "name": "consectetur",
                  "metrics": [
                    {
                      "MID": "e35dbe69-0fc3-4ef7-9411-a47225b60bf7",
                      "name": "ipsum"
                    },
                    {
                      "MID": "25ec631f-9eb4-4efd-80bb-21a8c10265a3",
                      "name": "labore"
                    },
                    {
                      "MID": "01131385-afe0-494d-968e-e2e2f4ad68f5",
                      "name": "quis"
                    },
                    {
                      "MID": "41e3b181-07d0-4a0d-966a-3cd34691d85e",
                      "name": "elit"
                    }
                  ]
                }
              ],
              "metrics": [
                {
                  "MID": "ebe5c0e5-5a2e-4302-84da-031f2fbdf2ed",
                  "name": "deserunt"
                },
                {
                  "MID": "20c87048-d0bf-4050-bc31-4449f5cdd2e6",
                  "name": "magna"
                },
                {
                  "MID": "50f06878-51eb-4661-91ca-0fecefae5114",
                  "name": "reprehenderit"
                },
                {
                  "MID": "4ff63c57-d5af-4932-8278-26ab4800f2d1",
                  "name": "laborum"
                },
                {
                  "MID": "5cd496ab-841d-43c2-9655-ea1f4111b63e",
                  "name": "pariatur"
                }
              ]
            }
          ]
        }
      }