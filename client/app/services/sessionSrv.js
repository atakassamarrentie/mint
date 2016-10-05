export default [
    '$cookies',
    'UserExt',
    sessionService
];

function sessionService($cookies, User) {
    this.logout = () => {
        
        User.logout({ access_token: self.token }).$promise.then(
            (res) => { self.token = null
                $cookies.remove('token')
                $cookies.remove('user')  
                },
            (err) => { this.error = err }
        )
    }

    this.login = (username, password) => {
        User.login({ username: username, password: password }).$promise.then(
            (res) => {
                this.response = res
                this.error = null
                this.token = res.id
                this.user = res.user
                $cookies.put('token', res.id)
                $cookies.putObject('user', res.user)
            },
            (err) => {
                this.error = err
                this.response = null
            }
        )
    }

}


