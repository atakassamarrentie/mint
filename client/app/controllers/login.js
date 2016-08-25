export default [
    '$scope',
    'sessionService',
    loginCtrl
];

function loginCtrl($scope, sessionService) {
    console.log("Login Controller")
    $scope.formly = {
        form: {},
        options: {},
        model: {},
        fields: [
            {
                key: 'username',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Username',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    required: true
                }
            }
        ],
        onSubmit: function ($event, model) {
            sessionService.login(model.username, model.password)
        }
    }

   
}