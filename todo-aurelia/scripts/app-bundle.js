define('app',["require", "exports", "aurelia-router"], function (require, exports, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Login';
            config.addAuthorizeStep(AuthorizeStep);
            config.map([
                { route: 'login', moduleId: 'components/login/login', nav: true, name: 'login', title: 'Login', settings: { roles: [] } },
                { route: 'register', moduleId: 'components/register/register', nav: true, name: 'register', title: 'Register', settings: { roles: [] } },
                { route: 'dashboard', moduleId: 'components/dashboard/dashboard', nav: true, name: 'dashboard', title: 'Dashboard', settings: { roles: ['admin'] } },
                { route: '', redirect: 'login' },
            ]);
            this.router = router;
        };
        return App;
    }());
    exports.App = App;
    var AuthorizeStep = (function () {
        function AuthorizeStep() {
        }
        AuthorizeStep.prototype.run = function (navigationInstruction, next) {
            if (navigationInstruction.getAllInstructions().some(function (i) { return i.config.settings.roles.indexOf('admin') !== -1; })) {
                var isAdmin = true;
                if (!isAdmin) {
                    return next.cancel(new aurelia_router_1.Redirect('login'));
                }
            }
            return next();
        };
        return AuthorizeStep;
    }());
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('edit-person',["require", "exports", "aurelia-framework", "aurelia-dialog"], function (require, exports, aurelia_framework_1, aurelia_dialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RatingDialog = (function () {
        function RatingDialog(controller) {
            this.heading = 'Rate me...';
            this.maxRating = 5;
            this.controller = controller;
        }
        RatingDialog.prototype.activate = function (rating) {
            if (rating === void 0) { rating = 1; }
            this.rating = rating;
        };
        RatingDialog.prototype.rate = function (event) {
            if (event.target.dataset.rate) {
                this.rating = event.target.dataset.rate;
            }
        };
        RatingDialog = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController),
            __metadata("design:paramtypes", [Object])
        ], RatingDialog);
        return RatingDialog;
    }());
    exports.RatingDialog = RatingDialog;
});



define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});



define('main',["require", "exports", "./environment", "aurelia-pal"], function (require, exports, environment_1, aurelia_pal_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        aurelia.use
            .standardConfiguration()
            .plugin('datatables');
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .plugin(aurelia_pal_1.PLATFORM.moduleName('aurelia-dialog'));
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('welcome',["require", "exports", "aurelia-framework", "aurelia-dialog", "./edit-person"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, edit_person_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(dialogService) {
            this.rating = 3;
            this.dialogService = dialogService;
        }
        App.prototype.rate = function () {
            var _this = this;
            this.dialogService.open({ viewModel: edit_person_1.RatingDialog, model: this.rating })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    console.log('OK');
                    _this.rating = response.output;
                }
                else {
                    console.log('Cancel');
                }
                console.log(response.output);
            });
        };
        App = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogService),
            __metadata("design:paramtypes", [Object])
        ], App);
        return App;
    }());
    exports.App = App;
});



define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});



define('utils/authen.service',["require", "exports", "aurelia-fetch-client", "./constants"], function (require, exports, aurelia_fetch_client_1, PRODUCT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Uid': 'tuantest1@gmail.com',
        'Client': 'y6_yWlNILBrklyKMmrI4rQ',
        'Access-Token': '1OGuHEwZ85_aBqil-NMTJQ'
    };
    var httpClient = new aurelia_fetch_client_1.HttpClient();
    httpClient.configure(function (config) {
        config
            .useStandardConfiguration()
            .withBaseUrl(PRODUCT.serverURL)
            .withDefaults({
            credentials: 'same-origin',
            headers: headers
        })
            .withInterceptor({
            request: function (request) {
                console.log("Requesting " + request.method + " " + request.url);
                return request;
            },
            response: function (response) {
                console.log(JSON.stringify(response));
                return response;
            }
        });
    });
    var AuthenService = (function () {
        function AuthenService() {
        }
        AuthenService.prototype.login = function (email, password) {
            var _this = this;
            return httpClient.fetch(PRODUCT.userSignInPATH, {
                method: 'post',
                body: aurelia_fetch_client_1.json({ email: email, password: password })
            })
                .then(function (response) {
                return response;
                _this.extractData(response);
            })
                .catch(this.handleError);
        };
        AuthenService.prototype.logout = function () {
            localStorage.removeItem('currentUser');
        };
        AuthenService.prototype.extractData = function (res) {
            if (res.status < 200 || res.status >= 300) {
                throw new Error('Bad response status: ' + res.status);
            }
        };
        AuthenService.prototype.handleError = function (error) {
            console.error('An error occurred', error);
            return Promise.reject(error.message || error);
        };
        return AuthenService;
    }());
    exports.AuthenService = AuthenService;
});



define('utils/constants',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serverURL = 'https://angular-task-list.herokuapp.com';
    exports.tasklistsPATH = '/task_lists';
    exports.todosPATH = 'todos';
    exports.userCreatePATH = '/auth';
    exports.userPasswordPATH = '/auth/password';
    exports.userSignInPATH = '/auth/sign_in';
    exports.getUsersPATH = '/users';
    exports.searchTodoPATH = '/search';
    exports.sharePATH = '/share';
    exports.tasklistsAuthorizedPATH = '/shared';
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('utils/user.service',["require", "exports", "aurelia-framework", "aurelia-fetch-client", "./authen.service", "./constants"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1, authen_service_1, PRODUCT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Uid': 'tuantest1@gmail.com',
        'Client': 'y6_yWlNILBrklyKMmrI4rQ',
        'Access-Token': '1OGuHEwZ85_aBqil-NMTJQ'
    };
    var httpClient = new aurelia_fetch_client_1.HttpClient();
    httpClient.configure(function (config) {
        config
            .useStandardConfiguration()
            .withBaseUrl(PRODUCT.serverURL)
            .withDefaults({
            credentials: 'same-origin',
            headers: headers
        })
            .withInterceptor({
            request: function (request) {
                return request;
            },
            response: function (response) {
                return response;
            }
        });
    });
    var UserService = (function () {
        function UserService(authenService) {
            this.authenService = authenService;
        }
        UserService.prototype.createUser = function (user) {
            return httpClient.fetch(PRODUCT.userCreatePATH, {
                method: 'post',
                body: aurelia_fetch_client_1.json(user)
            })
                .then(function (response) { return response.json(); })
                .catch(function () { return console.log('got failure'); });
        };
        UserService.prototype.changePassword = function (changepassword) {
            return httpClient.fetch(PRODUCT.userPasswordPATH, {
                method: 'put',
                body: aurelia_fetch_client_1.json(changepassword)
            })
                .then(function (response) { return response.json(); })
                .catch(function () { return console.log('got failure'); });
        };
        UserService.prototype.getUsers = function () {
            return httpClient.fetch(PRODUCT.getUsersPATH, {
                method: 'get'
            })
                .then(function (response) { return response.json(); })
                .catch(function () { return console.log('got failure'); });
        };
        UserService.prototype.getCurrentUser = function () {
            return 'tuantest1@gmail.com';
        };
        UserService = __decorate([
            aurelia_framework_1.inject(authen_service_1.AuthenService),
            __metadata("design:paramtypes", [authen_service_1.AuthenService])
        ], UserService);
        return UserService;
    }());
    exports.UserService = UserService;
});



define('components/dashboard/dashboard',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DashBoard = (function () {
        function DashBoard() {
        }
        DashBoard.prototype.configureRouter = function (config, router) {
            config.title = 'Dashboard';
            config.map([
                { route: 'tasklists', moduleId: 'components/dashboard/tasklists/tasklists', nav: true, name: 'tasklists', title: 'Tasklists' },
                { route: 'profile', moduleId: 'components/dashboard/profile/profile', nav: true, name: 'profile', title: 'Profile' },
                { route: '', redirect: 'tasklists' },
            ]);
            this.router = router;
        };
        return DashBoard;
    }());
    exports.DashBoard = DashBoard;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/login/login',["require", "exports", "../../utils/authen.service", "aurelia-router", "aurelia-framework"], function (require, exports, authen_service_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Login = (function () {
        function Login(router, authenService) {
            this.router = router;
            this.authenService = authenService;
            this.userLogin = {};
            this.loading = false;
        }
        Login.prototype.created = function () {
            this.authenService.logout();
        };
        Login.prototype.login = function () {
            var _this = this;
            this.loading = true;
            this.authenService.login(this.userLogin.email, this.userLogin.password)
                .then(function (response) {
                _this.router.navigate('dashboard');
            });
        };
        Login = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, authen_service_1.AuthenService),
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                authen_service_1.AuthenService])
        ], Login);
        return Login;
    }());
    exports.Login = Login;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/register/register',["require", "exports", "../../utils/user.service", "aurelia-router", "aurelia-framework"], function (require, exports, user_service_1, aurelia_router_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Register = (function () {
        function Register(router, userService) {
            this.router = router;
            this.userService = userService;
            this.userRegister = {};
            this.loading = false;
        }
        Register.prototype.register = function () {
            var _this = this;
            this.loading = true;
            this.userService.createUser(this.userRegister)
                .then(function () {
                alert('Register successfully, please Login.');
                _this.router.navigate('login');
            })
                .catch(function () { return alert('Register got failure!'); });
        };
        Register = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, user_service_1.UserService),
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                user_service_1.UserService])
        ], Register);
        return Register;
    }());
    exports.Register = Register;
});



define('utils/models/authen',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Authen = (function () {
        function Authen() {
        }
        return Authen;
    }());
    exports.Authen = Authen;
});



define('utils/models/index',["require", "exports", "./user", "./tasklist", "./password-change", "./todo", "./authen", "./todo-search"], function (require, exports, user_1, tasklist_1, password_change_1, todo_1, authen_1, todo_search_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(user_1);
    __export(tasklist_1);
    __export(password_change_1);
    __export(todo_1);
    __export(authen_1);
    __export(todo_search_1);
});



define('utils/models/password-change',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PasswordChange = (function () {
        function PasswordChange() {
        }
        return PasswordChange;
    }());
    exports.PasswordChange = PasswordChange;
});



define('utils/models/tasklist',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tasklist = (function () {
        function Tasklist() {
        }
        return Tasklist;
    }());
    exports.Tasklist = Tasklist;
});



define('utils/models/todo-search',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TodoSearch = (function () {
        function TodoSearch() {
        }
        return TodoSearch;
    }());
    exports.TodoSearch = TodoSearch;
});



define('utils/models/todo',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Todo = (function () {
        function Todo() {
        }
        return Todo;
    }());
    exports.Todo = Todo;
});



define('utils/models/user',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var User = (function () {
        function User() {
        }
        return User;
    }());
    exports.User = User;
});



define('utils/services/tasklist.service',["require", "exports", "aurelia-fetch-client", "../constants"], function (require, exports, aurelia_fetch_client_1, PRODUCT) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Uid': 'tuantest1@gmail.com',
        'Client': 'y6_yWlNILBrklyKMmrI4rQ',
        'Access-Token': '1OGuHEwZ85_aBqil-NMTJQ'
    };
    var httpClient = new aurelia_fetch_client_1.HttpClient();
    httpClient.configure(function (config) {
        config
            .useStandardConfiguration()
            .withBaseUrl(PRODUCT.serverURL)
            .withDefaults({
            credentials: 'same-origin',
            headers: headers
        })
            .withInterceptor({
            request: function (request) {
                return request;
            },
            response: function (response) {
                return response;
            }
        });
    });
    var TasklistService = (function () {
        function TasklistService() {
        }
        TasklistService.prototype.getTasklists = function () {
            return httpClient.fetch(PRODUCT.tasklistsPATH)
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('getTasklists got failure'); });
        };
        TasklistService.prototype.getTasklist = function (tasklist_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/")
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('getTasklist got failure'); });
        };
        TasklistService.prototype.getTasklistsAuthorized = function () {
            return httpClient.fetch(PRODUCT.tasklistsAuthorizedPATH)
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('getTasklistsAuthorized got failure'); });
        };
        TasklistService.prototype.getAuthorizedUsers = function (tasklist_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.sharePATH + "/", {
                method: 'get',
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.createAuthorizedUser = function (tasklist_id, user_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.sharePATH + "/", {
                method: 'post',
                body: aurelia_fetch_client_1.json({ user_id: user_id }),
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.updateAuthorizedUser = function (tasklist_id, user_id, is_write) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.sharePATH + "/", {
                method: 'put',
                body: aurelia_fetch_client_1.json({ user_id: user_id, is_write: is_write }),
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.deleteAuthorizedUser = function (tasklist_id, user_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.sharePATH + "/", {
                method: 'delete',
                body: aurelia_fetch_client_1.json({ user_id: user_id }),
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.createTasklist = function (tasklistName) {
            (function () { return console.log('createTasklist', tasklistName); });
            return httpClient.fetch("" + PRODUCT.tasklistsPATH, {
                method: 'post',
                body: aurelia_fetch_client_1.json({ name: tasklistName }),
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('createTasklist got failure'); });
        };
        TasklistService.prototype.deleteTasklist = function (id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + id + "/", {
                method: 'delete',
            })
                .then(function (response) {
                console.log("delete tasklist " + id + " success in service");
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.updateTasklist = function (tasklist_id, tasklist_name) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id, {
                method: 'put',
                body: aurelia_fetch_client_1.json({ name: tasklist_name })
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.getTodos = function (tasklist_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.todosPATH + "/", {
                method: 'get',
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.addTodo = function (tasklist_id, name) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.todosPATH + "/", {
                method: 'post',
                body: aurelia_fetch_client_1.json({ name: name })
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.updateTodo = function (tasklist_id, todo_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.todosPATH + "/" + todo_id, {
                method: 'put',
                body: aurelia_fetch_client_1.json({ done: true })
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.deleteTodo = function (tasklist_id, todo_id) {
            return httpClient.fetch(PRODUCT.tasklistsPATH + "/" + tasklist_id + "/" + PRODUCT.todosPATH + "/" + todo_id, {
                method: 'delete',
            })
                .then(function (response) {
                return response.json();
            })
                .catch(function () { return console.log('got failure'); });
        };
        TasklistService.prototype.extractData = function (res) {
            if (res.status < 200 || res.status >= 300) {
                throw new Error('Bad response status: ' + res.status);
            }
        };
        TasklistService.prototype.handleError = function (error) {
            console.error('An error occurred', error);
            return Promise.reject(error.message || error);
        };
        return TasklistService;
    }());
    exports.TasklistService = TasklistService;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/profile/profile',["require", "exports", "aurelia-framework", "../../../utils/user.service", "aurelia-router"], function (require, exports, aurelia_framework_1, user_service_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Profile = (function () {
        function Profile(router, userService) {
            this.router = router;
            this.userService = userService;
            this.newPassword = {};
        }
        Profile.prototype.created = function () {
            this.current_user = 'tuantest1@gmail.com';
        };
        Profile.prototype.changePassword = function () {
            var _this = this;
            this.userService.changePassword(this.newPassword)
                .then(function (data) {
                _this.router.navigate('/');
                alert('Change password success');
            })
                .catch(function () {
                alert('Change password fail');
            });
        };
        Profile = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, user_service_1.UserService),
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                user_service_1.UserService])
        ], Profile);
        return Profile;
    }());
    exports.Profile = Profile;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/tasklists/tasklists',["require", "exports", "aurelia-router", "../../../utils/services/tasklist.service", "../../../utils/user.service", "aurelia-framework", "aurelia-dialog", "./tasklist-detail/tasklist-detail", "./share-tasklist/share-tasklist", "./edit-tasklist/edit-tasklist", "jquery"], function (require, exports, aurelia_router_1, tasklist_service_1, user_service_1, aurelia_framework_1, aurelia_dialog_1, tasklist_detail_1, share_tasklist_1, edit_tasklist_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TaskLists = (function () {
        function TaskLists(router, dialogService, tasklistService, userService) {
            this.router = router;
            this.dialogService = dialogService;
            this.tasklistService = tasklistService;
            this.userService = userService;
            this.data = [];
            this.tasklistName = '';
        }
        TaskLists.prototype.renderDatatable = function () {
            $('#example').dataTable({
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
            });
        };
        TaskLists.prototype.created = function () {
            this.getTasklists();
            this.getUsers();
        };
        TaskLists.prototype.getUsers = function () {
            var _this = this;
            this.userService.getUsers()
                .then(function (data) { return _this.users = data; })
                .catch(function () { return console.log('getUsers fail'); });
        };
        TaskLists.prototype.getTasklists = function () {
            var _this = this;
            this.tasklistService.getTasklists()
                .then(function (data) {
                _this.data = data;
                console.log('Get tasklists success');
                _this.data.forEach(function (item) {
                    item.owner = true;
                    item.is_write = true;
                    item.user = _this.userService.getCurrentUser();
                });
                _this.data.map(function (item, index) {
                    _this.getAuthorizedUsers(item.id, index);
                    _this.getTodos(item.id, index);
                });
                _this.getTasklistsAuthorized();
            })
                .catch(function () { return console.log('getTasklists fail'); });
        };
        TaskLists.prototype.getTodos = function (tasklist_id, data_id) {
            var _this = this;
            this.tasklistService.getTodos(tasklist_id)
                .then(function (data) {
                _this.data[data_id].count = 0;
                data.forEach(function (item) {
                    if (!item.done) {
                        _this.data[data_id].count++;
                    }
                });
                _this.data[data_id].done = data.length - _this.data[data_id].count;
                console.log('Get todos success');
            })
                .catch(function (error) { return console.log('Get todos fail'); });
        };
        TaskLists.prototype.getTasklistsAuthorized = function () {
            var _this = this;
            this.tasklistService.getTasklistsAuthorized()
                .then(function (data) {
                data.forEach(function (item) {
                    item.user = _this.users.filter(function (h) { return h.id === item.user_id; })[0].email;
                });
                _this.data = _this.data.concat(data);
                console.log('getTasklistsAuthorized success');
            })
                .then(function () { return _this.renderDatatable(); })
                .catch(function () { return console.log('getTasklistsAuthorized fail'); });
        };
        TaskLists.prototype.getAuthorizedUsers = function (tasklist_id, data_id) {
            var _this = this;
            this.tasklistService.getAuthorizedUsers(tasklist_id)
                .then(function (data) {
                _this.data[data_id].share = data.length;
                _this.data[data_id].authorizedUsers = data;
                console.log('Get who authed tasklists success');
            })
                .catch(function () { return console.log('getAuthorizedUsers fail'); });
        };
        TaskLists.prototype.getTasklist = function (tasklist_id) {
            var _this = this;
            this.tasklistService.getTasklist(tasklist_id)
                .then(function (data) {
                _this.data.filter(function (h) { return h.id === tasklist_id; })[0].name = data.name;
                console.log("Get tasklist " + tasklist_id + " success");
            })
                .catch(function () { return console.log("Get tasklist " + tasklist_id + " fail"); });
        };
        TaskLists.prototype.createTasklist = function () {
            var _this = this;
            this.tasklistService.createTasklist(this.tasklistName)
                .then(function (response) {
                _this.data.push(response);
                _this.data[_this.data.length - 1].is_write = true;
                _this.data[_this.data.length - 1].owner = true;
                _this.data[_this.data.length - 1].share = 0;
                _this.data[_this.data.length - 1].count = 0;
                _this.data[_this.data.length - 1].done = 0;
                _this.data[_this.data.length - 1].user = _this.userService.getCurrentUser();
                _this.data[_this.data.length - 1].authorizedUsers = [];
                console.log('Create tasklist success');
                _this.tasklistName = '';
            })
                .catch(function () { return console.log("Create tasklist fail"); });
        };
        TaskLists.prototype.deleteTasklist = function (id) {
            var _this = this;
            this.tasklistService.deleteTasklist(id)
                .then(function () {
                _this.data = _this.data.filter(function (h) { return h.id !== id; });
                alert("Delete tasklist " + id + " success");
            })
                .catch(function () {
                console.log("Delete tasklist " + id + " fail");
                _this.data = _this.data.filter(function (h) { return h.id !== id; });
            });
        };
        TaskLists.prototype.showDetail = function (item) {
            this.dialogService.open({ viewModel: tasklist_detail_1.TasklistDetail, model: item })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    console.log('OK');
                }
                else {
                    console.log('Cancel');
                }
                console.log(response.output);
            });
        };
        TaskLists.prototype.share = function (item) {
            this.dialogService.open({ viewModel: share_tasklist_1.ShareTasklist, model: item })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    console.log('OK');
                }
                else {
                    console.log('Cancel');
                }
                console.log(response.output);
            });
        };
        TaskLists.prototype.edit = function (item) {
            this.dialogService.open({ viewModel: edit_tasklist_1.EditTasklist, model: item })
                .whenClosed(function (response) {
                if (!response.wasCancelled) {
                    item.name = response.output;
                    console.log('OK');
                }
                else {
                    console.log('Cancel');
                }
                console.log(response.output);
            });
        };
        TaskLists = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, aurelia_dialog_1.DialogService, tasklist_service_1.TasklistService, user_service_1.UserService),
            __metadata("design:paramtypes", [aurelia_router_1.Router,
                aurelia_dialog_1.DialogService,
                tasklist_service_1.TasklistService,
                user_service_1.UserService])
        ], TaskLists);
        return TaskLists;
    }());
    exports.TaskLists = TaskLists;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/tasklists/edit-tasklist/edit-tasklist',["require", "exports", "aurelia-framework", "aurelia-dialog", "../../../../utils/services/tasklist.service"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, tasklist_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditTasklist = (function () {
        function EditTasklist(controller, tasklistService) {
            this.controller = controller;
            this.tasklistService = tasklistService;
        }
        EditTasklist.prototype.activate = function (tasklist) {
            this.rename = tasklist.name;
            this.tasklist = tasklist;
        };
        EditTasklist.prototype.updateTasklist = function (tasklist_name) {
            var _this = this;
            this.tasklistService.updateTasklist(this.tasklist.id, tasklist_name)
                .then(function () { return console.log('Rename tasklist success'); })
                .then(function () { return _this.controller.ok(tasklist_name); })
                .catch(function () {
                console.log('Rename tasklist fail');
            });
        };
        EditTasklist.prototype.changeName = function (event) {
            if (event.target.dataset.name) {
                this.rename = event.target.dataset.name;
            }
        };
        EditTasklist = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, tasklist_service_1.TasklistService),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                tasklist_service_1.TasklistService])
        ], EditTasklist);
        return EditTasklist;
    }());
    exports.EditTasklist = EditTasklist;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/tasklists/share-tasklist/share-tasklist',["require", "exports", "aurelia-framework", "aurelia-dialog", "../../../../utils/user.service", "../../../../utils/services/tasklist.service"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, user_service_1, tasklist_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShareTasklist = (function () {
        function ShareTasklist(controller, userService, tasklistService) {
            this.controller = controller;
            this.userService = userService;
            this.tasklistService = tasklistService;
            this.user = [];
        }
        ShareTasklist.prototype.activate = function (tasklist) {
            this.tasklist = tasklist;
            this.authorizedUsers = this.tasklist.authorizedUsers;
        };
        ShareTasklist.prototype.created = function () {
            this.getUsers();
            console.log(this.authorizedUsers);
        };
        ShareTasklist.prototype.getUsers = function () {
            var _this = this;
            this.userService.getUsers()
                .then(function (data) {
                _this.users = data;
                console.log('Get users success');
                _this.users = _this.users.filter(function (h) { return h.email !== _this.userService.getCurrentUser()[0]; });
                if (_this.authorizedUsers) {
                    _this.authorizedUsers.forEach(function (item) {
                        item.user_email = _this.users.filter(function (h) { return h.id === item.user_id; })[0].email;
                        _this.users = _this.users.filter(function (h) { return h.id !== item.user_id; });
                    });
                }
            })
                .catch(function (error) { return console.log('Get users fail'); });
        };
        ShareTasklist.prototype.createAuthorizedUser = function (user_id) {
            var _this = this;
            this.tasklistService.createAuthorizedUser(this.tasklist.id, user_id)
                .then(function (data) {
                _this.authorizedUsers.push(data);
                var email = _this.users.filter(function (h) { return h.id === data.user_id; })[0].email;
                _this.authorizedUsers[_this.authorizedUsers.length - 1].user_email = email;
                console.log("Create Authen users success");
                _this.tasklist.share++;
                _this.users = _this.users.filter(function (h) { return h.id !== user_id; });
            })
                .catch(function (error) { return console.log('Create Authen users fail'); });
        };
        ShareTasklist.prototype.deleteAuthorizedUser = function (user_id) {
            var _this = this;
            this.tasklistService.deleteAuthorizedUser(this.tasklist.id, user_id)
                .then(function (data) {
                var email = _this.authorizedUsers.filter(function (h) { return h.user_id === user_id; })[0].user_email;
                _this.users.push({ id: user_id, email: email, password: '' });
                _this.authorizedUsers = _this.authorizedUsers.filter(function (h) { return h.user_id !== user_id; });
                console.log("Delete Authen users success");
                _this.tasklist.share--;
            })
                .catch(function (error) { return console.log('Delete Authen users fail'); });
        };
        ShareTasklist.prototype.updateAuthorizedUser = function (user_id) {
            var authen_user = this.authorizedUsers.filter(function (h) { return h.user_id === user_id; })[0];
            this.tasklistService.updateAuthorizedUser(this.tasklist.id, user_id, !authen_user.is_write)
                .then(function (data) {
                console.log(authen_user);
                authen_user.is_write = data.is_write;
                console.log('Update Authen users success');
            })
                .catch(function (error) { return console.log('Update Authen users fail'); });
        };
        ShareTasklist = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, user_service_1.UserService, tasklist_service_1.TasklistService),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                user_service_1.UserService,
                tasklist_service_1.TasklistService])
        ], ShareTasklist);
        return ShareTasklist;
    }());
    exports.ShareTasklist = ShareTasklist;
});



var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/tasklists/tasklist-detail/tasklist-detail',["require", "exports", "aurelia-framework", "aurelia-dialog", "../../../../utils/services/tasklist.service"], function (require, exports, aurelia_framework_1, aurelia_dialog_1, tasklist_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mockdata = [
        { id: 1, name: 'todo1', done: true },
        { id: 2, name: 'todo2', done: true },
        { id: 3, name: 'todo3', done: true },
        { id: 4, name: 'todo4', done: false },
        { id: 5, name: 'todo5', done: false },
        { id: 6, name: 'todo6', done: false },
    ];
    var TasklistDetail = (function () {
        function TasklistDetail(controller, tasklistService) {
            this.controller = controller;
            this.tasklistService = tasklistService;
            this.todos = [];
            this.newTodo = '';
        }
        TasklistDetail.prototype.activate = function (tasklist) {
            this.tasklist = tasklist;
        };
        TasklistDetail.prototype.created = function () {
            this.getTodos();
        };
        TasklistDetail.prototype.getTodos = function () {
            var _this = this;
            this.tasklistService.getTodos(this.tasklist.id)
                .then(function (data) {
                _this.todos = data;
                _this.tasklist.count = 0;
                data.forEach(function (item) {
                    if (!item.done) {
                        _this.tasklist.count++;
                    }
                });
                _this.tasklist.done = data.length - _this.tasklist.count;
                console.log('Get todos success');
            })
                .catch(function (error) { return console.log('Get todos fail'); });
        };
        TasklistDetail.prototype.addTodo = function (newTodo) {
            var _this = this;
            this.tasklistService.addTodo(this.tasklist.id, this.newTodo)
                .then(function () {
                console.log("Add todos " + _this.newTodo + " success");
                _this.getTodos();
            })
                .catch(function (error) { return console.log("Add todos " + _this.newTodo + " fail"); });
            this.newTodo = '';
        };
        TasklistDetail.prototype.updateTodo = function (todo_id) {
            var _this = this;
            this.tasklistService.updateTodo(this.tasklist.id, todo_id)
                .then(function (data) {
                console.log("Done todo " + todo_id + " success");
                _this.getTodos();
            })
                .catch(function (error) { return console.log("Done todo " + todo_id + " fail"); });
        };
        TasklistDetail.prototype.deleteTodo = function (todo_id) {
            var _this = this;
            this.tasklistService.deleteTodo(this.tasklist.id, todo_id)
                .then(function (data) {
                console.log("Delete todo " + todo_id + " success");
                _this.getTodos();
            })
                .catch(function (error) {
                console.log("Delete todo " + todo_id + " fail");
                _this.getTodos();
            });
        };
        TasklistDetail.prototype.doneAllTodos = function () {
            var _this = this;
            this.todos.forEach(function (item) {
                if (!item.done) {
                    _this.updateTodo(item.id);
                }
            });
            console.log('Done all todos');
        };
        TasklistDetail.prototype.deleteAllDones = function () {
            var _this = this;
            this.todos.forEach(function (item) {
                if (item.done) {
                    _this.deleteTodo(item.id);
                }
            });
            console.log('Delete all dones');
        };
        TasklistDetail = __decorate([
            aurelia_framework_1.inject(aurelia_dialog_1.DialogController, tasklist_service_1.TasklistService),
            __metadata("design:paramtypes", [aurelia_dialog_1.DialogController,
                tasklist_service_1.TasklistService])
        ], TasklistDetail);
        return TasklistDetail;
    }());
    exports.TasklistDetail = TasklistDetail;
});



define('text!app.html', ['module'], function(module) { module.exports = "<template><div><router-view></router-view></div></template>"; });
define('text!edit-person.html', ['module'], function(module) { module.exports = "<template><ai-dialog><ai-dialog-header>${heading}</ai-dialog-header><ai-dialog-body click.delegate=\"rate($event)\"><input value.bind=\"rating\"></ai-dialog-body><ai-dialog-footer><button click.delegate=\"controller.cancel()\">Cancel</button> <button click.delegate=\"controller.ok(rating)\">Ok</button></ai-dialog-footer></ai-dialog></template>"; });
define('text!components/dashboard/profile/profile.css', ['module'], function(module) { module.exports = ""; });
define('text!welcome.html', ['module'], function(module) { module.exports = "<template><button class=\"rating-button\" click.delegate=\"rate()\">Rate <span>${rating}</span></button></template>"; });
define('text!components/dashboard/tasklists/tasklists.css', ['module'], function(module) { module.exports = "#client-side-demo-container {\n  padding: 30px;\n  background-color: white;\n}\n#client-side-demo-container .loader {\n  position: absolute;\n  background-color: rgba(174, 176, 178, 0.2);\n  z-index: 9999;\n  width: 100%;\n  height: 100%;\n}\n#client-side-demo-container .loader i {\n  font-size: 25pt;\n  color: #333;\n  position: absolute;\n  width: unset;\n  top: 40%;\n  left: 47%;\n}\n#client-side-demo-container .content {\n  padding: 0;\n}\n#client-side-demo-container .filter-button {\n  padding: 0;\n  background-color: #ed682f;\n  color: white;\n  opacity: .8;\n  border-radius: 0;\n}\n#client-side-demo-container .nav .nav-item {\n  width: 25%;\n  text-align: center;\n  border: 1px #ed682f solid;\n  opacity: .8;\n}\n#client-side-demo-container .nav .nav-item .nav-link {\n  color: #ed682f;\n  text-transform: uppercase;\n}\n#client-side-demo-container .nav .nav-item .nav-link.active {\n  border-radius: 0;\n  background-color: #ed682f;\n  color: white;\n}\n#client-side-demo-container img {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n}\n#client-side-demo-container .btn-primary {\n  background-color: #333;\n  color: white;\n  border-color: #333;\n  border-radius: 0px;\n}\n#client-side-demo-container .header {\n  padding: 10px;\n  border-top: 1px solid #e9ecef;\n  border-left: 1px solid #e9ecef;\n  border-right: 1px solid #e9ecef;\n}\n#client-side-demo-container .header h6 {\n  margin-top: 10px;\n  margin-left: 10px;\n}\n#client-side-demo-container .form-control {\n  border-radius: 0;\n  outline: none;\n}\n#client-side-demo-container .descending {\n  margin-left: -7px !important;\n}\n#client-side-demo-container select.form-control {\n  width: 100%;\n  height: 38px;\n  -webkit-appearance: none;\n  font-size: 9pt;\n  -moz-appearance: none;\n  background: url(data:image/svg+xml;utf8,) #fff;\n  background-position: 98% 50%;\n  background-repeat: no-repeat;\n  border-radius: 0;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  padding: 2px 0 0 10px;\n}\n#client-side-demo-container table {\n  margin: 0;\n}\n#client-side-demo-container table thead .au-table-filter .btn-primary {\n  padding: 1px 6px 2px 6px;\n  border-radius: 0;\n}\n#client-side-demo-container table tbody tr.selected {\n  background-color: #333 !important;\n  color: white !important;\n}\n#client-side-demo-container table tbody tr td:first-child {\n  text-align: center;\n}\n#client-side-demo-container table tbody tr:hover {\n  background-color: #333;\n  color: white !important;\n  cursor: pointer;\n}\n#client-side-demo-container table tbody tr td {\n  vertical-align: middle;\n}\n#client-side-demo-container .footer {\n  padding: 10px 10px;\n  height: 55px;\n  border-left: 1px solid #e9ecef;\n  border-right: 1px solid #e9ecef;\n  border-bottom: 1px solid #e9ecef;\n}\n#client-side-demo-container .footer .col-md-6 {\n  padding: 0;\n}\n#client-side-demo-container .footer .au-table-info {\n  margin-top: 8px;\n  margin-left: 10px;\n}\n#client-side-demo-container .footer .info {\n  margin-top: 0px;\n  display: inline-block;\n}\n#client-side-demo-container .footer nav ul {\n  margin: 0;\n}\n#client-side-demo-container .footer nav ul li a {\n  border-radius: 0px;\n  color: #333;\n}\n#client-side-demo-container .footer nav ul li:hover {\n  cursor: pointer;\n}\n#client-side-demo-container .footer nav ul li.dots {\n  cursor: none !important;\n}\n#client-side-demo-container .footer nav ul li.active a {\n  background-color: #333;\n  border-color: #333;\n  color: white;\n}\n#client-side-demo-container .footer nav ul li.dots {\n  cursor: default !important;\n}\n#client-side-demo-container .footer nav ul li.dots a:hover {\n  background: white !important;\n}\n#client-side-demo-container .nav-tabs {\n  margin-top: 50px;\n}\n\n.glyphicon {\n  font-size: 12px;\n}\n\n.action-button {\n  display: inline-flex;\n}\n\nux-dialog-overlay.active {\n  background-color: black;\n  opacity: .65;\n}\n\nux-dialog-container>div>div {\nwidth: 60%;\n}\n\nux-dialog {\n  width: 100%;\n}\n"; });
define('text!components/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template><nav class=\"navbar navbar-inverse fix-position\"><div class=\"container-fluid\"><div class=\"navbar-header\"><a class=\"navbar-brand\">TODO LISTS</a></div><ul class=\"nav navbar-nav\"><li class=\"active\"><a route-href=\"route: tasklists\" class=\"btn btn-link\" id=\"tasklists-route\">Tasklists</a></li><li><a route-href=\"route: profile\" class=\"btn btn-link\" id=\"profile-route\">Profile</a></li></ul></div></nav><div class=\"container data-content\"><router-view></router-view></div></template>"; });
define('text!components/dashboard/tasklists/edit-tasklist/edit-tasklist.css', ['module'], function(module) { module.exports = "/*ux-dialog-container>div>div {*/\n  /*width: 60%;*/\n/*}*/\n"; });
define('text!components/login/login.html', ['module'], function(module) { module.exports = "<template><div class=\"col-md-6 col-md-offset-3\"><h2>Login</h2><form name=\"form\" submit.delegate=\"login()\"><div class=\"form-group\"><label>Email</label><input type=\"email\" class=\"form-control\" name=\"password\" value.bind=\"userLogin.email\"></div><div class=\"form-group\"><label>Password</label><input type=\"password\" class=\"form-control\" name=\"password\" value.bind=\"userLogin.password\"></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Login</button> <a route-href=\"route: register\" class=\"btn btn-link\" id=\"register-route\">Register</a></div></form></div></template>"; });
define('text!components/dashboard/tasklists/share-tasklist/share-tasklist.css', ['module'], function(module) { module.exports = ""; });
define('text!components/register/register.html', ['module'], function(module) { module.exports = "<template><div class=\"col-md-6 col-md-offset-3\"><h2>Register</h2><form name=\"form\" submit.delegate=\"register()\"><div class=\"form-group\"><label>Email</label><input type=\"email\" class=\"form-control\" name=\"password\" value.bind=\"userRegister.email\"></div><div class=\"form-group\"><label>Password</label><input type=\"password\" class=\"form-control\" name=\"password\" value.bind=\"userRegister.password\"></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Register</button> <a route-href=\"route: login\" class=\"btn btn-link\" id=\"login-route\">Cancel</a></div></form></div></template>"; });
define('text!components/dashboard/tasklists/tasklist-detail/tasklist-detail.css', ['module'], function(module) { module.exports = "ux-dialog-overlay.active {\n  background-color: black;\n  opacity: .65;\n}\n\n/*ux-dialog {*/\n  /*min-width: 600px;*/\n/*}*/\n"; });
define('text!components/dashboard/profile/profile.html', ['module'], function(module) { module.exports = "<template><div class=\"col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2\"><h3>Welcome ${current_user}</h3><button class=\"btn btn-warning\"><a route-href=\"route: login\" id=\"tasklists-route\">Logout</a></button><br><h3>Change Password</h3><form name=\"form\" submit.delegate=\"changePassword()\"><div class=\"form-group\"><label>Email</label><input type=\"email\" class=\"form-control\" name=\"password\" value.bind=\"userLogin.email\"></div><div class=\"form-group\"><label>Password</label><input type=\"password\" class=\"form-control\" name=\"password\" value.bind=\"userLogin.password\"></div><div class=\"form-group\"><button class=\"btn btn-primary\" type=\"submit\">Change Password</button></div></form></div></template>"; });
define('text!components/dashboard/tasklists/tasklists.html', ['module'], function(module) { module.exports = "<template><require from=\"./tasklists.css\"></require><form submit.trigger=\"createTasklist()\"><input type=\"text\" value.bind=\"tasklistName\"> <button type=\"submit\" class=\"btn btn-primary btn-sm\" disabled.bind=\"tasklistName===''\">Add Tasklist</button></form><hr><table id=\"example\" class=\"display\" cellspacing=\"0\" width=\"100%\"><thead><tr><th>ID</th><th>List Name</th><th>User</th><th>Share</th><th>Todo</th><th>Done</th><th>Action</th></tr></thead><tr if.bind=\"data.length > 0\" repeat.for=\"item of data\"><td>${item.id}</td><td>${item.name}</td><td>${item.user}</td><td>${item.share}</td><td>${item.count}</td><td>${item.done}</td><td class=\"text-center tl_action\"><div if.bind=\"item.owner\" class=\"action-button\"><button click.delegate=\"edit(item)\"><i class=\"glyphicon glyphicon-pencil\"></i></button> <button click.delegate=\"deleteTasklist(item.id)\"><i class=\"glyphicon glyphicon-remove\"></i></button> <button click.delegate=\"share(item)\"><i class=\"glyphicon glyphicon-share-alt\"></i></button> <button click.delegate=\"showDetail(item)\"><i class=\"glyphicon glyphicon-indent-left\"></i></button></div><div if.bind=\"(!item.owner) && (!item.is_write)\"><button class=\"btn btn-xs btn-warning\" click.delegate=\"showDetail(item)\">Read&nbsp;&nbsp;Only</button></div><div if.bind=\"(!item.owner) && (item.is_write)\"><button class=\"btn btn-xs btn-info\" click.delegate=\"showDetail(item)\">Show Detail</button></div></td></tr></table></template>"; });
define('text!components/dashboard/tasklists/edit-tasklist/edit-tasklist.html', ['module'], function(module) { module.exports = "<template><require from=\"./edit-tasklist.css\"></require><ux-dialog><ux-dialog-body click.delegate=\"changeName($event)\"><div><label>name:</label><input value.bind=\"rename\" value=\"${tasklist.name}\"></div></ux-dialog-body><ux-dialog-footer><button click.delegate=\"controller.cancel()\">Cancel</button> <button click.delegate=\"updateTasklist(rename)\">Ok</button></ux-dialog-footer></ux-dialog></template>"; });
define('text!components/dashboard/tasklists/share-tasklist/share-tasklist.html', ['module'], function(module) { module.exports = "<template><require from=\"./share-tasklist.css\"></require><ux-dialog><ux-dialog-body><div class=\"row\"><div class=\"col-xs-12\"><div class=\"button-group\" style=\"display:inline-block\"><button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\" id=\"control-share\">Share All Actions <span class=\"glyphicon glyphicon-cog\"></span> <span class=\"caret\"></span></button><ul class=\"dropdown-menu\"><li repeat.for=\"user of users\"><div click.delegate=\"createAuthorizedUser(user.id)\">&nbsp; ${user.email} &nbsp;</div></li></ul></div><div repeat.for=\"authen_user of authorizedUsers\" style=\"display:inline-block\"><div><span style=\"cursor:pointer\" class=\"label ${authen_user.is_write == true ? 'label-success' : 'label-default'}\" click.delegate=\"updateAuthorizedUser(authen_user.user_id)\">Write</span><div click.delegate=\"deleteAuthorizedUser(authen_user.user_id)\" style=\"display:inline-block;cursor:pointer\" class=\"${authen_user.is_write == true ? 'text-primary' : 'text-muted'}\">&nbsp;${authen_user.user_email} </div><span>&nbsp;|&nbsp;</span></div></div></div></div></ux-dialog-body><ux-dialog-footer><button click.delegate=\"controller.cancel()\">Cancel</button> <button click.delegate=\"controller.ok(rating)\">Ok</button></ux-dialog-footer></ux-dialog></template>"; });
define('text!components/dashboard/tasklists/tasklist-detail/tasklist-detail.html', ['module'], function(module) { module.exports = "<template><require from=\"./tasklist-detail.css\"></require><ux-dialog><ux-dialog-body><div class=\"row\"><div class=\"col-sm-6\"><h3>TODOS</h3><div class=\"input-group\" if.bind=\"tasklist.is_write\"><form submit.trigger=\"addTodo(newTodo)\"><input type=\"text\" value.bind=\"newTodo\"> <button type=\"submit\" class=\"btn btn-primary btn-sm\" disabled.bind=\"newTodo===''\">Add Todo</button></form></div><div [hidden]=\"newTodo\"></div><div [hidden]=\"!newTodo\">Typing: ${newTodo} </div><br><div><div repeat.for=\"todo of todos\"><div if.bind=\"!todo.done\" style=\"margin:1.5%\"><button class=\"btn btn-info btn-xs\" click.delegate=\"updateTodo(todo.id)\" disabled.bind=\"!tasklist.is_write\">Done</button> <span>&nbsp;${todo.name}</span></div></div></div><br><div><button click.delegate=\"doneAllTodos()\" class=\"btn btn-primary btn-sm\" disabled.bind=\"!tasklist.is_write || tasklist.count < 1\">Mark all as Done</button></div></div><div class=\"col-sm-6\"><h3>DONE</h3><div><div repeat.for=\"todo of todos\"><div if.bind=\"todo.done\" style=\"margin:1.5%\"><button class=\"btn btn-warning btn-xs\" click.delegate=\"deleteTodo(todo.id)\" disabled.bind=\"!tasklist.is_write\">Delete</button> <span>&nbsp;${todo.name}</span></div></div></div><br><div><button click.delegate=\"deleteAllDones()\" class=\"btn btn-danger btn-sm\" disabled.bind=\"!tasklist.is_write || tasklist.done < 1\">Delete all Done</button></div></div></div></ux-dialog-body><ux-dialog-footer><button click.delegate=\"controller.cancel()\">Cancel</button> <button click.delegate=\"controller.ok(rating)\">Ok</button></ux-dialog-footer></ux-dialog></template>"; });
//# sourceMappingURL=app-bundle.js.map