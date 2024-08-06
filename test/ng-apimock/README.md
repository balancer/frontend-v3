#### How to use ng-apimock:

- add _NEXT_PUBLIC_BALANCER_API_URL=http://localhost:9999/ngapimock/graphql_ to _.env_
- run NPM script _start-mock-server_ to start ng-apimock
- run NPM script _start-dev_ to start development

#### Create a new mock:

- from the 'real' api, copy the response you want and paste it in a new json file in the _data_
  folder
- copy an existing \*_.mock.json_ file and update _name_, _operationName_, _query_ & _file_ (this
  points to the json file from the previous step)
- optional: add extra responses aka scenarios to the mock

> **Note**: _watch_ is disabled by default, enable it by adding the option in _server.js_. Otherwise
> you can refresh to get the updated or new mocks by stopping and starting ng-apimock.

When ng-apimock is running the dev interface is available on http://localhost:9999/dev-interface/#/.
Here you can choose between the different scenarios and/or presets that have been created
beforehand.
