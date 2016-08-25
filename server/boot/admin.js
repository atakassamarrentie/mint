var loopback = require('loopback');
var prompt = require('prompt');
var Role
var RoleMapping
var app

module.exports = function (lb) {
    app = lb
    Role = app.models.Role
    RoleMapping = app.models.RoleMapping
    findOrCreateAdminRole("admin").then((instance, created) => {
        RoleMapping.count({ where: { roleId: 104 } }, function (err, count) {
            if (err) console.log(err)
            if (count == 0) createAdmin(instance)
        })
    })
    console.log("done")
}

function findOrCreateAdminRole(roleName) {
    return new Promise(function (resolve, reject) {
        Role.findOrCreate({ where: { name: roleName } },
            { name: roleName },
            function (err, instance, created) {
                if (err) reject(err)
                resolve(instance, created)
            }
        )
    })
}

function createAdmin(adminRole) {
    var User = app.models.UserExt
    console.log(`No administrator account found! Do you want to create one?`)
    prompt.start();
    prompt.get({ name: "answer", message: '(Y for yes, anything else for cancel)' }, function (err, result) {
        if (err) console.log(err)
        if (result.answer == "Y") {
            //loopForAnswer("username").then((resolve, reject) => {
            prompt.get([{ name: "username", required: "true" },
                { name: "firstname", required: "true" },
                { name: "lastname", required: "true" },
                { name: "email", required: "true" },
                { name: "password", required: "true", hidden: "true" },
            ], function (err, result) {
                User.findOrCreate({
                    where: { or: 
                        [{username: result.username},
                        {email: result.email}]
                    }
                }, {
                        firstname: result.firstname,
                        lastname: result.lastname,
                        username: result.username,
                        email: result.email,
                        password: result.password,
                        active: "Y",
                        emailVerified: "Y"
                    },
                    function (err, createdUserInstance) {
                        if (err) console.log(err)
                        RoleMapping.findOrCreate(
                            {
                                where: {
                                    and: [{ principalType: "USER" },
                                        { principalId: createdUserInstance.id },
                                        { roleId: adminRole.id }]
                                }
                            },
                            {
                                principalType: "USER",
                                principalId: createdUserInstance.id,
                                roleId: adminRole.id
                            },
                            function (err, instance, created) {
                                if (err) console.log(err)
                                if (created) console.log("Admin account created successfully!")

                            }
                        )
                    })
            })

        }
    })
}

function onErr(err) {
    console.log(err)
    return 1
}
/*
function loopForAnswer(prop) {
    return new Promise(function (resolve, reject) {
        
        do {
            prompt.start();
            prompt.get({ name: prop }, function (err, result) {
                if (err) { console.log(err) }
                console.log("'",result[prop].length,"'")
                if (result[prop] == "") {console.log(prop, 'can\'t be blank')} else {console.log("OK")}
            })
        } while (result[prop] == "")
        console.log("kész")
        resolve(result)
    })
}





*/

