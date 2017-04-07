
// jshint-ignore
@directive('app.core', 'helloWorld')
@inject('$http')
// end-ignore
class HelloDirective {

    static config() {
        return {
            restrict: 'E',
            templateUrl: 'app/core/directives/hello/hello.template.html',
            scope: true,
        };
    }

    static link() {
        console.log('k');
    }

    constructor() {
        
    }
}