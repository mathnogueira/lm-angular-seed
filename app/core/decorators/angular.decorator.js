/**
 * ES7 Decorators to declare angular controllers, services, etc.
 */

/**
 * Annotation for registering a class as an angular controller.
 * 
 * @param {string} module name of the module.
 * @param {string} name name of the controller.
 * @return controller decorator.
 */
function controller(module, name) {
    return function(target) {
        __ngAddComponent(module, name, 'controller', target);
        return target;
    };
}

/**
 * Annotation for registering a class as an angular service.
 * 
 * @param {string} module name of the module.
 * @param {string} name name of the service.
 * @return service decorator.
 */
function service(module, name) {
    return function(target) {
        __ngAddComponent(module, name, 'service', target);
        return target;
    };
}

/**
 * Annotation for registering a class as an angular factory.
 * 
 * @param {string} module name of the module.
 * @param {string} name name of the factory.
 * @return factory decorator.
 */
function factory(module, name) {
    return function(target) {
        __ngAddComponent(module, name, 'factory', target);
        return target;
    };
}

/**
 * Annotation for registering a class as an angular directive.
 * 
 * Note that your class must have the methods config and link as static.
 * 
 * @param {string} module name of the module
 * @param {string} name name of the directive
 * @return directive decorator.
 */
function directive(module, name) {
    return function(target) {
        let config = target.config();
        config.controller = target;
        config.link = target.link;
        __ngAddComponent(module, name, 'directive', () => config);
        return target;
    };
}

/**
 * Annotation for injecting dependencies in an angular component.
 * 
 * @param {Array} dependencies array of dependencies to be injected,
 *                             if a string is passed, it is considered a single dependency.
 * @return injector decorator
 */
function inject(dependencies) {
    return function(target) {
        let deps = Array.isArray(dependencies) ? dependencies : [dependencies];
        target.$inject = deps;
        return target;
    };
}

// Private functions

function __ngAddComponent(module, name, type, target)  {
    angular.module(module)[type](name, target);
}