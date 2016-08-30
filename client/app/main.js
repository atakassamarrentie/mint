/**
 * @author    László Simon {@link http://pho3nixnest.com}
 * @copyright Copyright (c) 2015, László Simon
 * @license   ???
 */

// Css
import "app/resources/css/style.css!";
import "angular/angular-csp.css!";
import "angular-material/angular-material.css!";
import "app/resources/fonts/material-icons.css!";

// Common
import "jquery";
import "angular-messages";
import "angular-material";
import "angular-cookies";
import "angular-resource";
import "angular-route";
import "api-check";
import "angular-formly";
import "angular-formly-material";


// Lib
import 'app/lib/lb-services';


import app from 'app/app';

// Bootstrap
angular.element(document).ready(function () {
    angular.bootstrap(document, [app.name], {
        strictDi: false //Some component (ex. mdDialog) fails if true (Cannot be minified)
    });
});