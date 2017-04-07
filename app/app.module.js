angular
    .module('app', [
        'app.core'
    ]);

// jshint-ignore
@controller('app', 'MyController')
@inject(['$http'])
// end-ignore
class MyController {

    constructor($http) {
        console.log('MyController is constructed');
    }
}